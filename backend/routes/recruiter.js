const express = require("express");
const authController = require("../controllers/auth");
const jobController = require("../controllers/job");
const applicationController = require("../controllers/application");
const userController = require("../controllers/user");

const router = express.Router();

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Recruiter"),
    jobController.getJobRec
  );

router
  .route("/emp")
  .get(
    authController.protect,
    authController.restrictTo("Recruiter"),
    userController.recEmp
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo("Recruiter"),
    applicationController.getJobApp
  );

module.exports = router;
