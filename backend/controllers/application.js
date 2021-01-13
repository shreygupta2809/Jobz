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

    var today = new Date();
    if (job.deadline < today) {
      return res.status(400).json({
        errors: [{ msg: "Deadline to apply has passed" }],
      });
    }

    const applicantId = req.user.id;
    const jobId = req.params.id;

    const appJobs = await Application.find({
      job: jobId,
    });

    let curApp = 0,
      accApp = 0;

    for (var i = 0; i < appJobs.length; i++) {
      const el = appJobs[i];
      if (el.status === "Accepted") accApp++;
      if (el.status === "Applied" || el.status === "Shortlisted") curApp++;
    }

    if (curApp >= job.maxApp) {
      return res.status(400).json({
        errors: [
          {
            msg: "Maximum Number of Application for this job have been reached",
          },
        ],
      });
    }

    if (accApp >= job.maxPos) {
      return res.status(400).json({
        errors: [{ msg: "All positions for this job have been filled" }],
      });
    }

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
      return res.status(400).json({
        errors: [{ msg: "You have already been accepted for a job" }],
      });
    }
    if (count >= 10) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You cannot apply for any more jobs" }] });
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
      const appJobs = await Application.find({
        job: application.job,
        status: { $nin: ["Rejected", "Shortlisted", "Applied"] },
      });
      if (appJobs.length >= job.maxPos) {
        return res.status(400).json({
          errors: [{ msg: "All positions for this job have been filled" }],
        });
      }

      if (application.status === "Rejected") {
        return res.status(400).json({
          errors: [{ msg: "You cannot accept a rejected application" }],
        });
      }
      const applicantId = application.applicant;
      const jobId = application.job;

      application.status = status;
      await application.save();

      await Application.updateMany(
        { applicant: applicantId, _id: { $ne: req.params.id } },
        { status: "Rejected" }
      );

      if (appJobs.length + 1 == job.maxPos) {
        await Application.updateMany(
          { job: jobId, _id: { $ne: req.params.id } },
          { status: "Rejected" }
        );
      }
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

exports.myApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate({
        path: "job",
        select: "recruiter date salary ratings",
        populate: { path: "recruiter", select: "name" },
      })
      .select("title status date")
      .lean();

    applications.forEach(function (el) {
      if (el.job.ratings.length) {
        el.job.avgRating =
          el.job.ratings.reduce((total, next) => total + next.value, 0) /
          el.job.ratings.length;
      } else {
        el.job.avgRating = 0;
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        data: applications,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.getJobApp = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job.recruiter.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ errors: [{ msg: "You are not authorized to view this job" }] });
    }
    const applications = await Application.find({
      job: req.params.id,
      status: { $ne: "Rejected" },
    })
      .populate({
        path: "applicant",
        select: "name skill education ratings",
      })
      .select("status date sop")
      .lean();

    applications.forEach(function (el) {
      if (el.applicant.ratings.length) {
        el.applicant.avgRating =
          el.applicant.ratings.reduce((total, next) => total + next.value, 0) /
          el.applicant.ratings.length;
      } else {
        el.applicant.avgRating = 0;
      }
    });

    res.status(200).json({
      status: "success",
      data: {
        data: applications,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
