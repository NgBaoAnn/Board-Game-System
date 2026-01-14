const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const ReviewValidator = require("../validators/review.validator");
const { validationResult } = require("express-validator");

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

// Public routes (no auth required)
router.get(
    "/games/:gameId/reviews/average",
    ReviewValidator.validateGameId(),
    validate,
    reviewController.getAverageRating
);

router.get(
    "/games/:gameId/reviews/summary",
    ReviewValidator.validateGameId(),
    validate,
    reviewController.getReviewSummary
);

router.get(
    "/games/:gameId/reviews",
    ReviewValidator.validateGameId(),
    validate,
    reviewController.getReviews
);

// Protected routes (auth required)
router.post(
    "/games/:gameId/reviews",
    authMiddleware.authenticate,
    ReviewValidator.submitReview(),
    validate,
    reviewController.submitReview
);

router.delete(
    "/games/:gameId/reviews/:reviewId",
    authMiddleware.authenticate,
    reviewController.deleteReview
);

module.exports = router;
