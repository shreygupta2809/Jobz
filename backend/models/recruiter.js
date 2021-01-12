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
  },
  {
    discriminatorKey: "role",
  }
);

module.exports = User.discriminator("Recruiter", RecruiterSchema);
