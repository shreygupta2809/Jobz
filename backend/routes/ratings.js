const express = require("express");
const authController = require("../controllers/auth");
const ratingController = require("../controllers/rating");

const router = express.Router();

router.post(
  "/job/:id",
  authController.protect,
  authController.restrictTo("Applicant"),
  ratingController.rateJob
);

router.post(
  "/applicant/:id",
  authController.protect,
  authController.restrictTo("Recruiter"),
  ratingController.rateApplicant
);

module.exports = router;
