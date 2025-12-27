const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score.controller");

/**
 * POST /api/scores
 * Submit a score for a game (optionally authenticated)
 * Request body: { game_type, score }
 */
router.post("/scores", scoreController.submitScore);

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
router.get("/scores/user-rank/:gameType", scoreController.getUserGameRank);

module.exports = router;
