const Job = require("../models/job");
const Recruiter = require("../models/recruiter");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      salary,
      deadline,
      skill,
      type,
      duration,
      maxPos,
      maxApp,
    } = req.body;
    if (
      !title ||
      salary === undefined ||
      !deadline ||
      !type ||
      duration === undefined ||
      maxPos === undefined ||
      maxApp === undefined
    ) {
      return res.status(400).json({
        errors: [{ msg: "Please enter all details" }],
      });
    }

    if (salary < 0) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid salary" }],
      });
    }

    types = ["Full Time", "Part Time", "Work From Home"];
    if (!types.includes(type)) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid type" }],
      });
    }
    durations = [0, 1, 2, 3, 4, 5, 6];
    if (!durations.includes(duration)) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid duaration" }],
      });
    }
    if (maxPos <= 0 || maxApp <= 0) {
      return res.status(400).json({
        errors: [
          { msg: "Please enter valid number of Applications and Positions" },
        ],
      });
    }

    // var today = new Date();

    // if (deadline <= today) {
    //   return res.status(400).json({
    //     errors: [{ msg: "Deadline should be in the future" }],
    //   });
    // }

    const recruiterId = req.user.id;

    var job = new Job({
      title,
      salary,
      deadline,
      skill,
      type,
      duration,
      maxPos,
      maxApp,
      recruiter: recruiterId,
    });

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

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ errors: [{ msg: "No Job with that Id" }] });
    }

    if (job.recruiter.toString() === req.user.id) {
      await job.delete();

      res.status(204).json({
        status: "Success",
        data: null,
      });
    } else {
      return res.status(404).json({
        errors: [{ msg: "You are not authorized to delete this job" }],
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ errors: [{ msg: "No Job with that Id" }] });
    }

    if (job.recruiter.toString() === req.user.id) {
      const { deadline, maxPos, maxApp } = req.body;

      if (maxPos) {
        if (maxPos > 0) {
          job.maxPos = maxPos;
        } else {
          return res.status(400).json({
            errors: [
              {
                msg: "Please enter valid number of Positions",
              },
            ],
          });
        }
      }

      if (maxApp) {
        if (maxApp > 0) {
          job.maxApp = maxApp;
        } else {
          return res.status(400).json({
            errors: [
              {
                msg: "Please enter valid number of Applications",
              },
            ],
          });
        }
      }

      await job.save();

      res.status(200).json({
        status: "success",
        data: {
          data: job,
        },
      });
    } else {
      return res.status(404).json({
        errors: [{ msg: "You are not authorized to edit this job" }],
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
