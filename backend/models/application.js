const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  sop: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Apply", "Applied", "Shortlisted", "Rejected", "Accepted"],
    required: true,
    default: "Applied",
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateAcc: {
    type: Date,
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
