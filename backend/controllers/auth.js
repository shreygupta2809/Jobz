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
  return str.replace(/\s+/g, " ").trim().split(" ").length;
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        errors: [{ msg: "Please enter all details" }],
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        errors: [{ msg: "Please enter valid email" }],
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        errors: [{ msg: "Minimum length of password is 6 characters" }],
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
      }
      if (bio) {
        if (typeof bio !== "string" || countWords(bio) > 250) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Max Word Limit of Bio is 250 words" }] });
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
      return res
        .status(400)
        .json({ errors: [{ msg: "Please enter valid role" }] });
    }

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    createSendToken(user, 201, req, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Please enter all details" }] });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    createSendToken(user, 200, req, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res
        .status(401)
        .json({ errors: [{ msg: "You are not logged in!" }] });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Invalid token" }] });
    }
    req.user = user;

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return res.status(401).json({
        errors: [{ msg: "You are not authorized to perform this action" }],
      });
    }
    next();
  };
};
