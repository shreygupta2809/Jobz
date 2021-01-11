const express = require("express");
const authController = require("../controllers/auth");
const jobController = require("../controllers/job");

const router = express.Router();

router.post(
  "/",
  authController.protect,
  authController.restrictTo("Recruiter"),
  jobController.createJob
);

router
  .route("/:id")
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
