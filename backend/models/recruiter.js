const mongoose = require("mongoose");
const User = require("./user");

const RecruiterSchema = new mongoose.Schema(
  {
    contact: {
      type: Number,
    },
    bio: {
      type: String,
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
  },
  {
    discriminatorKey: "role",
  }
);

module.exports = User.discriminator("Recruiter", RecruiterSchema);
