const Applicant = require("../models/applicant");
const Application = require("../models/application");
const Recruiter = require("../models/recruiter");
const Job = require("../models/job");

exports.rateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(400).json({ errors: [{ msg: "No Job with that Id" }] });
    }

    const { value } = req.body;
    const appId = req.user.id;

    const application = await Application.findOne({
      job: req.params.id,
      status: "Accepted",
      applicant: appId,
    });
    if (!application) {
      return res.status(400).json({
        errors: [
          { msg: "You can only rate a job in which you have been accepted" },
        ],
      });
    }
    const setRatings = [1, 2, 3, 4, 5];
    if (!setRatings.includes(value)) {
      return res.status(400).json({
        errors: [{ msg: "Please give a valid integer rating from 1-5" }],
      });
    }

    const payload = {
      appId,
      value,
    };

    const found = job.ratings.some((el) => el.appId.toString() === appId);
    if (found) {
      return res.status(400).json({
        errors: [{ msg: "You have already rated the job" }],
      });
    }

    job.ratings.push(payload);
    await job.save();

    res.status(200).json({
      status: "success",
      data: {
        data: job,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.rateApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No Applicant with that Id" }] });
    }

    const { value } = req.body;
    const recId = req.user.id;

    const application = await Application.findOne({
      status: "Accepted",
      applicant: req.params.id,
    });
    if (!application) {
      return res.status(400).json({
        errors: [
          { msg: "You can only rate an applicant who has been accepted" },
        ],
      });
    }

    const job = await Job.findById(application.job);
    if (job.recruiter.toString() !== recId) {
      return res.status(400).json({
        errors: [{ msg: "You can only rate an employee of your organization" }],
      });
    }

    const setRatings = [1, 2, 3, 4, 5];
    if (!setRatings.includes(value)) {
      return res.status(400).json({
        errors: [{ msg: "Please give a valid integer rating from 1-5" }],
      });
    }

    const payload = {
      recId,
      value,
    };

    const found = applicant.ratings.some((el) => el.recId.toString() === recId);
    if (found) {
      return res.status(400).json({
        errors: [{ msg: "You have already rated this employee" }],
      });
    }

    applicant.ratings.push(payload);
    await applicant.save();

    res.status(200).json({
      status: "success",
      data: {
        data: applicant,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
