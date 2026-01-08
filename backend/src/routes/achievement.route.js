const express = require("express");
const router = express.Router();

router.post("/achievement");
router.put("/achievement/:id");
router.delete("/achievement/:id");
router.get("/achievement/:id");
router.get("/achievements/:game_id");
router.get("/achievements/:game_id/:user_id");

module.exports = router;
