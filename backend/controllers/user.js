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
