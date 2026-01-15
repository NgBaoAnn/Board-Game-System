const reviewRepo = require("../repositories/review.repo");
const gameRepo = require("../repositories/game.repo");
const NotFoundError = require("../errors/notfound.exception");
const BadRequestError = require("../errors/badrequest.exception");

class ReviewService {
    /**
     * Get average rating for a game
     */
    async getAverageRating(gameId) {
        const game = await gameRepo.findById(gameId);
        if (!game) {
            throw new NotFoundError("Game not found");
        }

        return reviewRepo.getAverageRating(gameId);
    }

    /**
     * Get review summary (average, total, distribution)
     */
    async getReviewSummary(gameId) {
        const game = await gameRepo.findById(gameId);
        if (!game) {
            throw new NotFoundError("Game not found");
        }

        const [ratingData, distributionData] = await Promise.all([
            reviewRepo.getAverageRating(gameId),
            reviewRepo.getRatingDistribution(gameId),
        ]);

        return {
            average: parseFloat(ratingData.average) || 0,
            total: ratingData.total,
            distribution: distributionData.percentages,
        };
    }

    /**
     * Get paginated reviews for a game
     */
    async getReviews(gameId, page = 1, limit = 10) {
        const game = await gameRepo.findById(gameId);
        if (!game) {
            throw new NotFoundError("Game not found");
        }

        const offset = (page - 1) * limit;

        const [reviews, countResult] = await Promise.all([
            reviewRepo.findByGameId(gameId, offset, limit),
            reviewRepo.countByGameId(gameId),
        ]);

        const total = parseInt(countResult.total) || 0;

        return {
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Submit a review (create or update if exists)
     */
    async submitReview(userId, gameId, rating, comment) {
        const game = await gameRepo.findById(gameId);
        if (!game) {
            throw new NotFoundError("Game not found");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new BadRequestError("Rating must be between 1 and 5");
        }

        // Check if user has played this game at least once (finished session)
        const hasPlayed = await gameRepo.hasUserPlayedGame(userId, gameId);
        if (!hasPlayed) {
            throw new BadRequestError("Bạn cần chơi ít nhất một trận để đánh giá game này");
        }

        // Check if user already reviewed this game
        const existingReview = await reviewRepo.findByUserAndGame(userId, gameId);

        if (existingReview) {
            // Người dùng đã đánh giá rồi
            throw new BadRequestError("Bạn đã đánh giá trò chơi này rồi");
        }

        // Create new review
        return reviewRepo.create({
            user_id: userId,
            game_id: gameId,
            rating,
            comment,
        });
    }

    /**
     * Delete a review (only owner can delete)
     */
    async deleteReview(userId, reviewId) {
        const review = await reviewRepo.findById(reviewId);

        if (!review) {
            throw new NotFoundError("Review not found");
        }

        if (review.user_id !== userId) {
            throw new BadRequestError("You can only delete your own reviews");
        }

        return reviewRepo.delete(reviewId);
    }
}

module.exports = new ReviewService();
