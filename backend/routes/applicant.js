const express = require("express");
const authController = require("../controllers/auth");
const jobController = require("../controllers/job");
const applicationController = require("../controllers/application");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Applicant"),
    jobController.getJobs
  );

router
  .route("/myApp")
  .get(
    authController.protect,
    authController.restrictTo("Applicant"),
    applicationController.myApplications
  );

module.exports = router;
