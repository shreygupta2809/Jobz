const mongoose = require("mongoose");
const User = require("./user");

const Recruiter = User.discriminator(
  "Recruiter",
  new mongoose.Schema({
    contact: {
      type: Number,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    employee: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Applicant",
      },
    ],
  })
);

module.exports = mongoose.model(Recruiter);
