const { body, param } = require("express-validator");
const {
  ACHIEVEMENT_CONDITION_TYPE_VALUES,
} = require("../constants/achievement.constants");

class AchievementValidator {
  static createAchievement() {
    return [
      body("code")
        .notEmpty()
        .withMessage("Code is required")
        .isString()
        .withMessage("Code must be a string")
        .isLength({ max: 255 })
        .withMessage("Code must not exceed 255 characters"),

      body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 255 })
        .withMessage("Name must not exceed 255 characters"),

      body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

      body("icon").optional(),

      body("game_id")
        .notEmpty()
        .withMessage("Game ID is required")
        .isInt({ min: 1 })
        .withMessage("Game ID must be a positive integer"),

      body("condition_type")
        .notEmpty()
        .withMessage("Condition type is required")
        .isIn(ACHIEVEMENT_CONDITION_TYPE_VALUES)
        .withMessage(
          `Condition type must be one of: ${ACHIEVEMENT_CONDITION_TYPE_VALUES.join(
            ", "
          )}`
        ),

      body("condition_value")
        .notEmpty()
        .withMessage("Condition value is required")
        .isInt({ min: 1 })
        .withMessage("Condition value must be a positive integer"),
    ];
  }

  static updateAchievement() {
    return [
      param("id").isUUID().withMessage("Achievement ID must be a valid UUID"),

      body("code")
        .optional()
        .isString()
        .withMessage("Code must be a string")
        .isLength({ max: 255 })
        .withMessage("Code must not exceed 255 characters"),

      body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 255 })
        .withMessage("Name must not exceed 255 characters"),

      body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

      body("icon").optional(),

      body("game_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Game ID must be a positive integer"),

      body("condition_type")
        .optional()
        .isIn(ACHIEVEMENT_CONDITION_TYPE_VALUES)
        .withMessage(
          `Condition type must be one of: ${ACHIEVEMENT_CONDITION_TYPE_VALUES.join(
            ", "
          )}`
        ),

      body("condition_value")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Condition value must be a positive integer"),
    ];
  }

  static getAchievementById() {
    return [
      param("id").isUUID().withMessage("Achievement ID must be a valid UUID"),
    ];
  }

  static deleteAchievement() {
    return [
      param("id").isUUID().withMessage("Achievement ID must be a valid UUID"),
    ];
  }

  static getAchievementsByGameId() {
    return [
      param("game_id")
        .isInt({ min: 1 })
        .withMessage("Game ID must be a positive integer"),
    ];
  }

  static getUserAchievementsByGameId() {
    return [
      param("game_id")
        .isInt({ min: 1 })
        .withMessage("Game ID must be a positive integer"),
      param("user_id").isUUID().withMessage("User ID must be a valid UUID"),
    ];
  }
}

module.exports = AchievementValidator;
