const Job = require("../models/job");
const Recruiter = require("../models/recruiter");
const Application = require("../models/application");
const job = require("../models/job");

// function isValidDate(dateString) {
//   var regEx = /^\d{4}-\d{2}-\d{2}$/;
//   if (!dateString.match(regEx)) return false;
//   var d = new Date(dateString);
//   var dNum = d.getTime();
//   if (!dNum && dNum !== 0) return false;
//   return d.toISOString().slice(0, 10) === dateString;
// }

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

exports.createJob = async (req, res) => {
  try {
    let {
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

    if (salary <= 0) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid salary" }],
      });
    }

    types = ["Full-Time", "Part-Time", "Work-From-Home"];
    if (!types.includes(type)) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid type" }],
      });
    }
    durations = [0, 1, 2, 3, 4, 5, 6];
    duration = duration * 1;
    if (!durations.includes(duration)) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid duration" }],
      });
    }
    if (maxPos <= 0 || maxApp <= 0) {
      return res.status(400).json({
        errors: [
          { msg: "Please enter valid number of Applications and Positions" },
        ],
      });
    }

    // if (!isValidDate(deadline)) {
    //   return res.status(400).json({
    //     errors: [{ msg: "Enter Deadline in YYYY-MM-DD Format" }],
    //   });
    // }

    var today = new Date();
    var tempDate = new Date(deadline);
    if (tempDate <= today) {
      return res.status(400).json({
        errors: [{ msg: "Deadline should be in the future" }],
      });
    }

    if (skill) {
      skill = skill.filter(unique);
      skill = skill.filter((item) => item);
    }

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

      await Application.deleteMany({ job: req.params.id });

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
        if (maxPos > 0 && job.maxPos <= maxPos) {
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
        if (maxApp > 0 && job.maxApp <= maxApp) {
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

      if (deadline) {
        // if (!isValidDate(deadline)) {
        //   return res.status(400).json({
        //     errors: [{ msg: "Enter Deadline in YYYY-MM-DD Format" }],
        //   });
        // }

        var today = new Date();
        var tempDate = new Date(deadline);
        if (tempDate <= today) {
          return res.status(400).json({
            errors: [{ msg: "Deadline should be in the future" }],
          });
        } else {
          job.deadline = deadline;
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

exports.getJobs = async (req, res) => {
  try {
    const conditions = {};
    // const sortCond = {};
    if (req.query.jobType) {
      conditions.type = req.query.jobType;
    }
    if (req.query.duration) {
      conditions.duration = { $lt: req.query.duration * 1 };
    }
    if (req.query.salary) {
      let minSal, maxSal;
      [minSal, maxSal] = req.query.salary.split("-");
      if (minSal && maxSal)
        conditions.salary = { $gte: minSal * 1, $lte: maxSal * 1 };
      else if (minSal) conditions.salary = { $gte: minSal * 1 };
      else if (maxSal) conditions.salary = { $lte: maxSal * 1 };
    }

    conditions.deadline = { $gt: Date.now() };

    const jobs = await Job.find(conditions)
      .select("title recruiter ratings salary duration deadline maxPos type")
      .populate({
        path: "recruiter",
        select: "_id name email",
      })
      .lean();

    const applications = await Application.find({ applicant: req.user.id });

    for (var i = 0; i < jobs.length; i++) {
      let applied = "Apply";
      for (var j = 0; j < applications.length; j++) {
        if (applications[j].job.toString() === jobs[i]._id.toString()) {
          applied = "Applied";
          break;
        }
      }
      jobs[i].applied = applied;
    }

    const jobApplication = await Application.find({ status: "Accepted" });

    for (var i = 0; i < jobs.length; i++) {
      let count = 0;
      for (var j = 0; j < jobApplication.length; j++) {
        if (jobApplication[j].job.toString() === jobs[i]._id.toString()) {
          count++;
        }
      }
      const full = jobs[i].maxPos === count;
      jobs[i].full = full;
      jobs[i].leftPos = jobs[i].maxPos - count;
    }

    jobs.forEach(function (el) {
      if (el.ratings.length) {
        el.avgRating =
          el.ratings.reduce((total, next) => total + next.value, 0) /
          el.ratings.length;
      } else {
        el.avgRating = 0;
      }
    });
    // .sort(sortString);

    // const jobs = await Job.aggregate([
    //   {
    //     $match: conditions,
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "recruiter",
    //       foreignField: "_id",
    //       as: "recruiters",
    //     },
    //   },
    //   {
    //     $addFields: {
    //       avgRating: { $avg: "$ratings.value" },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       title: 1,
    //       // "recruiters._id": 1,
    //       // "recruiters.name": 1,
    //       // "recruiters.email": 1,
    //       recruiter: { $arrayElemAt: ["$recruiters", 0] },
    //       avgRating: 1,
    //       salary: 1,
    //       duration: 1,
    //       deadline: 1,
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       title: 1,
    //       "recruiter._id": 1,
    //       "recruiter.name": 1,
    //       "recruiter.email": 1,
    //       avgRating: 1,
    //       salary: 1,
    //       duration: 1,
    //       deadline: 1,
    //     },
    //   },
    //   {
    //     $sort: sortCond,
    //   },
    // ]);

    res.status(200).json({
      status: "success",
      data: {
        data: jobs,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.getJobRec = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .select("title datePost maxPos")
      .lean();
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({ job: { $in: jobIds } });
    let newJobs = [];
    for (var i = 0; i < jobIds.length; i++) {
      let count = 0;
      let count1 = 0;
      for (var j = 0; j < applications.length; j++) {
        const el = applications[j];
        if (
          el.status !== "Rejected" &&
          el.job.toString() === jobIds[i].toString()
        )
          count++;
        if (
          el.status === "Accepted" &&
          el.job.toString() === jobIds[i].toString()
        )
          count1++;
      }

      jobs[i].numApplicants = count;
      jobs[i].posLeft = jobs[i].maxPos - count1;
      if (jobs[i].posLeft) newJobs.push(jobs[i]);
    }
    res.status(200).json({
      status: "success",
      data: {
        data: newJobs,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
