const Application = require("../models/application");
const Job = require("../models/job");

function countWords(str) {
  return str.replace(/\s+/g, " ").trim().split(" ").length;
}

exports.apply = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ errors: [{ msg: "No Job with that Id" }] });
    }

    const { sop } = req.body;
    if (!sop) {
      return res.status(400).json({
        errors: [{ msg: "Please enter the Statement of Purpose" }],
      });
    }

    if (typeof sop !== "string" || countWords(sop) > 250) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Max Word Limit of SOP is 250 words" }] });
    }

    const applicantId = req.user.id;
    const jobId = req.params.id;

    const myApps = await Application.find({
      applicant: applicantId,
    });

    let isAccepted = 0,
      count = 0;
    for (var i = 0; i < myApps.length; i++) {
      const el = myApps[i];
      if (el.status === "Accepted") isAccepted = 1;
      if (el.status === "Applied" || el.status === "Shortlisted") count++;
      if (el.job.toString() === req.params.id) {
        return res
          .status(400)
          .json({ errors: [{ msg: "You have already applied for this job" }] });
      }
    }
    if (isAccepted) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You have already been accepted" }] });
    }
    if (count >= 10) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You cannot apply for any more jobs" }] });
    }

    var application = new Application({
      sop,
      job: jobId,
      applicant: applicantId,
    });

    await application.save();

    res.status(200).json({
      status: "success",
      data: {
        data: application,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res
        .status(404)
        .json({ errors: [{ msg: "No Application with that Id" }] });
    }
    const job = await Job.findById(application.job);
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(404).json({
        errors: [{ msg: "You are not authorized to edit this application" }],
      });
    }

    const { status } = req.body;

    if (status === "Accepted") {
      if (application.status === "Rejected") {
        return res.status(400).json({
          errors: [{ msg: "You cannot accept a rejected application" }],
        });
      }
      const applicantId = application.applicant;

      application.status = status;
      await application.save();

      await Application.updateMany(
        { applicant: applicantId, _id: { $ne: req.params.id } },
        { status: "Rejected" }
      );
    } else if (status === "Shortlisted" || status === "Rejected") {
      if (application.status === "Accepted") {
        return res.status(400).json({
          errors: [
            { msg: "You cannot change status of an accepted application" },
          ],
        });
      }
      application.status = status;
      await application.save();
    } else {
      return res
        .status(400)
        .json({ errors: [{ msg: "Please enter valid status" }] });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: application,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
