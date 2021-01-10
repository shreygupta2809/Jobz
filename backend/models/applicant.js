const mongoose = require("mongoose");
const User = require("./user");

const Applicant = User.discriminator(
  "Applicant",
  new mongoose.Schema({
    ratings: [
      {
        appId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recruiter",
        },
        value: {
          type: Number,
        },
      },
    ],
    skill: [String],
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    resume: {
      type: String,
    },
    photo: {
      type: String,
    },
    education: [
      {
        institute: {
          type: String,
          required: true,
        },
        startYear: {
          type: Number,
          required: true,
          validate: {
            validator: Number.isInteger,
            message: "{VALUE} not an integer value",
          },
        },
        endYear: {
          type: Number,
          validate: {
            validator: Number.isInteger,
            message: "{VALUE} not an integer value",
          },
        },
      },
    ],
  })
);

module.exports = mongoose.model(Applicant);
