const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const ROLE = require("../constants/role");

router.get("/games", gameController.getAllGames);

router.get("/games/active", gameController.getActiveGames);

router.get("/games/:id", gameController.getGameById);

router.post(
  "/games",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  gameController.createGame
);

router.put(
  "/games/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  gameController.updateGame
);

router.delete(
  "/games/:id",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
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

router.get(
  "/games/sessions/exists/:id",
  authMiddleware.authenticate,
  gameController.isSessionSavedExists
);

router.get(
  "/games/sessions/history/:userId",
  authMiddleware.authenticate,
  gameController.getGameHistory
);

router.get(
  "/games/stats/play",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  gameController.getGamePlayStats
);

router.get(
  "/games/stats/activity",
  authMiddleware.authenticate,
  authMiddleware.authorize([ROLE.ADMIN]),
  gameController.getGameActivity
);

module.exports = router;
