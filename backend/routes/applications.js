const express = require("express");
const authController = require("../controllers/auth");
const applicationController = require("../controllers/application");

const router = express.Router();

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("Recruiter"),
    applicationController.changeStatus
  );

module.exports = router;
