const express = require("express");
const router = express.Router();

router.post("/users", (req, res) => res.send("ok"));
router.get("/users/:id", (req, res) => res.send("ok"));
router.get("/users", (req, res) => res.send("ok"));
router.delete("/users/:id", (req, res) => res.send("ok"));

module.exports = router;
