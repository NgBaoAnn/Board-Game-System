const express = require("express");
const router = express.Router();
const authValidator = require("../validators/auth.validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", authValidator.register(), authController.register);
router.post("/login", authValidator.login(), authController.login);
router.post("/logout", authMiddleware.authenticate, authController.logout);
router.get("/account", authMiddleware.authenticate, authController.account);
router.post("/refresh-token", authController.refreshToken);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
