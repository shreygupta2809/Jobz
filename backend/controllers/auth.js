const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Applicant = require("../models/applicant");
const Recruiter = require("../models/recruiter");
const bcrypt = require("bcryptjs");

const createSendToken = (user, statusCode, req, res) => {
  jwt.sign(
    {
      user: {
        id: user.id,
      },
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 36000000,
    },
    (err, token) => {
      if (err) throw err;
      res.status(statusCode).json({ token });
    }
  );
};

function countWords(str) {
  str = str.replace(/(^\s*)|(\s*$)/gi, "");
  str = str.replace(/[ ]{2,}/gi, " ");
  str = str.replace(/\n /, "\n");
  return str.split(" ").length;
}

// function validateEmail(email) {
//   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// }

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        status: "error",
        message: "Please enter Details",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Please enter valid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Minimum length of password is 6 characters",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
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
              status: "error",
              message: "Please enter correct institute and start date",
            });
          }
          if (el.endYear && el.endYear < el.startYear) {
            return res.status(400).json({
              status: "error",
              message: "End date cannot be eariler than start date",
            });
          }
        }
      }

      user = new Applicant({
        name,
        email,
        password,
        role,
        skill,
        education,
      });
    } else if (role === "Recruiter") {
      const { contact, bio } = req.body;
      if (
        typeof contact !== "number" ||
        contact < 111111111 ||
        contact > 9999999999
      ) {
        return res.status(400).json({
          status: "error",
          message: "Please enter valid contact number",
        });
      }
      if (bio) {
        if (typeof bio !== "string" || countWords(bio) > 250) {
          return res.status(400).json({
            status: "error",
            message: "Max Word Limit of Bio is 250 words",
          });
        }
      }
      user = new Recruiter({
        name,
        email,
        password,
        role,
        contact,
        bio,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Please enter valid role",
      });
    }

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    createSendToken(user, 201, req, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};
