const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      min: [0, "Salary cannot be negative"],
    },
    datePost: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: true,
    },
    skill: [String],
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Work-From-Home"],
      default: "Full-Time",
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
      max: 6,
      required: true,
    },
    maxPos: {
      type: Number,
      min: [0, "Number of Positions cannot be negative"],
      required: true,
    },
    maxApp: {
      type: Number,
      min: [0, "Number of Applications cannot be negative"],
      required: true,
    },
    ratings: [
      {
        appId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Applicant",
        },
        value: {
          type: Number,
        },
      },
    ],
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// JobSchema.virtual("avgRating").get(function () {
//   let avg = 0;
//   if (this.ratings.length) {
//     avg = this.ratings.reduce((total, next) => total + next.value, 0) /
//       this.ratings.length;
//   }
//   return avg;
// });

module.exports = mongoose.model("Job", JobSchema);
