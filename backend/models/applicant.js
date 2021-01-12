const mongoose = require("mongoose");
const User = require("./user");

const ApplicantSchema = new mongoose.Schema(
  {
    ratings: [
      {
        recId: {
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
        },
        endYear: {
          type: Number,
        },
      },
    ],
  },
  {
    discriminatorKey: "role",
  }
);

module.exports = User.discriminator("Applicant", ApplicantSchema);
