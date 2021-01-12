const express = require("express");
const authController = require("../controllers/auth");
const jobController = require("../controllers/job");
const applicationController = require("../controllers/application");

const router = express.Router();

router.post(
  "/",
  authController.protect,
  authController.restrictTo("Recruiter"),
  jobController.createJob
);

router
  .route("/:id")
  .post(
    authController.protect,
    authController.restrictTo("Applicant"),
    applicationController.apply
  )
  .patch(
    authController.protect,
    authController.restrictTo("Recruiter"),
    jobController.updateJob
  )
  .delete(
    authController.protect,
    authController.restrictTo("Recruiter"),
    jobController.deleteJob
  );

module.exports = router;
