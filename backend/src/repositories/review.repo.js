const db = require("../databases/knex");
const MODULE = require("../constants/module");

class ReviewRepo {
    /**
     * Create a new review
     */
    create(data) {
        return db(MODULE.GAME_REVIEW)
            .insert(data)
            .returning("*")
            .then(([row]) => row);
    }

    /**
     * Update an existing review
     */
    update(id, data) {
        return db(MODULE.GAME_REVIEW)
            .where("id", id)
            .update({ ...data, updated_at: db.fn.now() })
            .returning("*")
            .then(([row]) => row);
    }

    /**
     * Find review by user and game
     */
    findByUserAndGame(userId, gameId) {
        return db(MODULE.GAME_REVIEW)
            .where("user_id", userId)
            .andWhere("game_id", gameId)
            .first();
    }

    /**
     * Find review by ID
     */
    findById(id) {
        return db(MODULE.GAME_REVIEW).where("id", id).first();
    }

    /**
     * Get paginated reviews for a game with user info
     */
    findByGameId(gameId, offset = 0, limit = 10) {
        return db(MODULE.GAME_REVIEW)
            .select(
                "game_reviews.id",
                "game_reviews.rating",
                "game_reviews.comment",
                "game_reviews.created_at",
                "game_reviews.updated_at",
                "users.id as user_id",
                "users.username",
                "users.avatar_url"
            )
            .leftJoin("users", "game_reviews.user_id", "users.id")
            .where("game_reviews.game_id", gameId)
            .orderBy("game_reviews.updated_at", "desc")
            .limit(limit)
            .offset(offset);
    }

    /**
     * Count total reviews for a game
     */
    countByGameId(gameId) {
        return db(MODULE.GAME_REVIEW)
            .where("game_id", gameId)
            .count("id as total")
            .first();
    }

    /**
     * Get average rating for a game
     */
    async getAverageRating(gameId) {
        const result = await db(MODULE.GAME_REVIEW)
            .where("game_id", gameId)
            .avg("rating as average")
            .count("id as total")
            .first();

        return {
            average: result.average ? parseFloat(result.average).toFixed(1) : 0,
            total: parseInt(result.total) || 0,
        };
    }

    /**
     * Get rating distribution for a game (count per star)
     */
    async getRatingDistribution(gameId) {
        const results = await db(MODULE.GAME_REVIEW)
            .select("rating")
            .count("id as count")
            .where("game_id", gameId)
            .groupBy("rating")
            .orderBy("rating", "desc");

        // Build distribution object
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let total = 0;

        results.forEach((row) => {
            distribution[row.rating] = parseInt(row.count);
            total += parseInt(row.count);
        });

        // Calculate percentages
        const percentages = {};
        for (let i = 5; i >= 1; i--) {
            percentages[i] = total > 0 ? Math.round((distribution[i] / total) * 100) : 0;
        }

        return {
            distribution,
            percentages,
            total,
        };
    }

    /**
     * Delete a review
     */
    delete(id) {
        return db(MODULE.GAME_REVIEW).where("id", id).del();
    }
}

module.exports = new ReviewRepo();
