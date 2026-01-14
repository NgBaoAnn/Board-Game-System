const { body, param } = require("express-validator");

class ReviewValidator {
    /**
     * Validate submit review request
     */
    static submitReview() {
        return [
            param("gameId")
                .notEmpty()
                .withMessage("Game ID is required")
                .isInt({ min: 1 })
                .withMessage("Game ID must be a positive integer"),

            body("rating")
                .notEmpty()
                .withMessage("Rating is required")
                .isInt({ min: 1, max: 5 })
                .withMessage("Rating must be between 1 and 5"),

            body("comment")
                .notEmpty()
                .withMessage("Comment is required")
                .isString()
                .withMessage("Comment must be a string")
                .isLength({ min: 1, max: 500 })
                .withMessage("Comment must be between 1 and 500 characters"),
        ];
    }

    /**
     * Validate game ID parameter
     */
    static validateGameId() {
        return [
            param("gameId")
                .notEmpty()
                .withMessage("Game ID is required")
                .isInt({ min: 1 })
                .withMessage("Game ID must be a positive integer"),
        ];
    }
}

module.exports = ReviewValidator;
