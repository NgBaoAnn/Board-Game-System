const express = require("express");
const router = express.Router();
const rankingController = require("../controllers/ranking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/ranking/myself/:game_id",
  authMiddleware.authenticate,
  rankingController.getMySelfRanking
);
router.get(
  "/ranking/friend/:game_id",
  authMiddleware.authenticate,
  rankingController.getFriendRanking
);
router.get("/ranking/system/:game_id", rankingController.getSystemRanking);

module.exports = router;
