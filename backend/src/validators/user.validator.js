const { body, param } = require("express-validator");

class UserValidator {
  static create() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),

      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

      body("username").notEmpty().withMessage("username is required"),
    ];
  }

  static getById() {
    return [param("id").isUUID().withMessage("User id must be a valid UUID")];
  }
  static update() {
    return [
      param("id").isUUID().withMessage("User id must be a valid UUID"),

      body("username")
        .optional()
        .isString()
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters"),

      body("email")
        .optional()
        .isEmail()
        .withMessage("Email must be a valid email address"),

      body("avatar_url")
        .optional()
        .isURL()
        .withMessage("Avatar url must be a valid URL"),

      body("phone")
        .optional()
        .isString()
        .isLength({ max: 20 })
        .withMessage("Phone must be less than 20 characters"),

      body("bio")
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage("Bio must be less than 500 characters"),

      body("location")
        .optional()
        .isString()
        .isLength({ max: 100 })
        .withMessage("Location must be less than 100 characters"),

      body("status")
        .optional()
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid status"),

      body("role_id").optional().isInt().withMessage("Role id must be integer"),

      body("active").optional().isBoolean().withMessage("Active must be boolean"),

      body().custom((_, { req }) => {
        const allowed = ["username", "email", "avatar_url", "phone", "bio", "location", "status", "role_id", "active"];
        const keys = Object.keys(req.body);

        const extra = keys.filter((k) => !allowed.includes(k));
        if (extra.length) {
          throw new Error(`Extra fields not allowed: ${extra.join(", ")}`);
        }
        return true;
      }),
    ];
  }
  static delete() {
    return [param("id").isUUID().withMessage("User id must be a valid UUID")];
  }
}

module.exports = UserValidator;
