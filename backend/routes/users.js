const express = require("express");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/", authController.protect, userController.me);
router.patch("/update", authController.protect, userController.updateUser);

module.exports = router;
