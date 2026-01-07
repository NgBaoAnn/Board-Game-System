const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/games", gameController.getAllGames);

router.get("/games/active", gameController.getActiveGames);

router.get("/games/:id", gameController.getGameById);

router.post("/games", authMiddleware.authenticate, gameController.createGame);

router.put(
  "/games/:id",
  authMiddleware.authenticate,
  gameController.updateGame
);

router.delete(
  "/games/:id",
  authMiddleware.authenticate,
  gameController.deleteGame
);

router.post(
  "/games/sessions",
  authMiddleware.authenticate,
  gameController.startSession
);

router.put(
  "/games/sessions/:id/save",
  authMiddleware.authenticate,
  gameController.saveSession
);

router.put(
  "/games/sessions/:id/finish",
  authMiddleware.authenticate,
  gameController.finishSession
);

module.exports = router;
