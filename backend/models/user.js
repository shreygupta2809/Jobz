const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["Applicant", "Recruiter"],
      required: true,
      default: "Applicant",
    },
  },
  {
    discriminatorKey: "role",
  }
);

module.exports = mongoose.model("User", UserSchema);
