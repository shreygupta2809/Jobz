const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  sop: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Apply", "Applied", "Shortlisted", "Rejected"],
    required: true,
    default: "Apply",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
