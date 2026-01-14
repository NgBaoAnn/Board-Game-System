const HTTP_STATUS = require("../constants/http-status");
const reviewService = require("../services/review.service");
const ResponseHandler = require("../utils/response-handler");

class ReviewController {
    /**
     * Get average rating for a game
     * GET /api/games/:gameId/reviews/average
     */
    async getAverageRating(req, res, next) {
        try {
            const { gameId } = req.params;
            const result = await reviewService.getAverageRating(parseInt(gameId));

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Average rating retrieved successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get review summary (average, total, distribution)
     * GET /api/games/:gameId/reviews/summary
     */
    async getReviewSummary(req, res, next) {
        try {
            const { gameId } = req.params;
            const result = await reviewService.getReviewSummary(parseInt(gameId));

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Review summary retrieved successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Get paginated reviews for a game
     * GET /api/games/:gameId/reviews
     */
    async getReviews(req, res, next) {
        try {
            const { gameId } = req.params;
            const { page, limit } = req.query;

            const result = await reviewService.getReviews(
                parseInt(gameId),
                parseInt(page) || 1,
                parseInt(limit) || 10
            );

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Reviews retrieved successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Submit a review
     * POST /api/games/:gameId/reviews
     */
    async submitReview(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameId } = req.params;
            const { rating, comment } = req.body;

            const result = await reviewService.submitReview(
                userId,
                parseInt(gameId),
                parseInt(rating),
                comment
            );

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.CREATED,
                message: "Review submitted successfully",
                data: result,
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Delete a review
     * DELETE /api/games/:gameId/reviews/:reviewId
     */
    async deleteReview(req, res, next) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;

            await reviewService.deleteReview(userId, parseInt(reviewId));

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: "Review deleted successfully",
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new ReviewController();
