const Job = require("../models/job");
const Recruiter = require("../models/recruiter");
const Application = require("../models/application");
const User = require("../models/user");
const Applicant = require("../models/applicant");

exports.me = async (req, res) => {
  try {
    const userId = req.user.id;
    let user;
    if (req.user.role === "Recruiter") {
      user = await Recruiter.findById(userId);
    } else if (req.user.role === "Applicant") {
      user = await Applicant.findById(userId);
    } else {
      return res.status(400).json({ errors: [{ msg: "Unknown User" }] });
    }
    user.password = undefined;
    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.recEmp = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });
    const jobIds = jobs.map((job) => job.id);
    const employees = await Application.find({
      status: "Accepted",
      job: { $in: jobIds },
    })
      .populate([
        {
          path: "applicant",
          select: "name ratings",
        },
        {
          path: "job",
          select: "type title",
        },
      ])
      .select("date")
      .lean();

    employees.forEach(function (el) {
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
        data: employees,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    const role = user.role;
    const { name } = req.body;
    if (name) {
      user.name = name;
    }

    if (role === "Applicant") {
      const { skill, education } = req.body;

      var today = new Date();
      var year = today.getFullYear();
      if (education) {
        for (var i = 0; i < education.length; i++) {
          el = education[i];
          if (
            !el.institute ||
            !el.startYear ||
            typeof el.startYear !== "number" ||
            el.startYear > year
          ) {
            return res.status(400).json({
              errors: [
                { msg: "Please enter correct institute and start date" },
              ],
            });
          }
          if (el.endYear && el.endYear < el.startYear) {
            return res.status(400).json({
              errors: [{ msg: "End date cannot be eariler than start date" }],
            });
          }
        }
        user.education = education;
      }

      if (skill) {
        user.skill = skill;
      }
    } else if (role === "Recruiter") {
      const { contact, bio } = req.body;
      if (contact) {
        if (
          typeof contact !== "number" ||
          contact < 111111111 ||
          contact > 9999999999
        ) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Please enter valid contact number" }] });
        }
        user.contact = contact;
      }
      if (bio) {
        if (typeof bio !== "string" || countWords(bio) > 250) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Max Word Limit of Bio is 250 words" }] });
        }
        user.bio = bio;
      }
    }

    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        data: user,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
