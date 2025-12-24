const express = require("express");
const authValidator = require("../validators/auth.validator");
const router = express.Router();

router.post("/register", authValidator.register(), (req, res) =>
  res.send("ok")
);
router.post("/login", authValidator.login(), (req, res) => res.send("ok"));

module.exports = router;
