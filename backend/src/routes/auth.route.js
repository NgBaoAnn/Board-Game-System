const express = require("express");
const authValidator = require("../validators/auth.validator");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", authValidator.register(), authController.register);
router.post("/login", authValidator.login(), authController.login);

module.exports = router;
