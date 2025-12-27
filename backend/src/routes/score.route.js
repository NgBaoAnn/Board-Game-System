const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/**
 * POST /api/scores
 * Submit a score for a game (optionally authenticated)
 * Request body: { game_type, score }
 */
router.post("/scores",authMiddleware.authenticate, scoreController.submitScore);

/**
 * GET /api/scores/me
 * Get authenticated user's all scores with pagination
 * Query params: gameType (optional), page (optional, default 1), limit (optional, default 10)
 * Requires authentication
 */
router.get("/scores/me", authMiddleware.authenticate, scoreController.getMyScores);

/**
 * GET /api/scores/best/:gameType
 * Get authenticated user's best score for a specific game
 * Requires authentication
 */
router.get("/scores/best/:gameType", authMiddleware.authenticate, scoreController.getMyBestScore);

/**
 * GET /api/scores/ranking/:gameType
 * Get leaderboard for a specific game
 * Query params: limit (optional, default 10)
 */
router.get("/scores/ranking/:gameType", scoreController.getLeaderboard);

/**
 * GET /api/scores/global-top
 * Get global top scores across all games
 * Query params: limit (optional, default 10)
 */
router.get("/scores/global-top", scoreController.getGlobalTopScores);

/**
 * GET /api/scores/user-rank/:gameType
 * Get authenticated user's ranking for a specific game
 * Requires authentication
 */
router.get("/scores/user-rank/:gameType", authMiddleware.authenticate, scoreController.getUserGameRank);

module.exports = router;
