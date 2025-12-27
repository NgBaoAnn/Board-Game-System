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
        .withMessage("Username must be string"),

      body("avatar_url")
        .optional()
        .isURL()
        .withMessage("Avatar url must be a valid URL"),

      body("status")
        .optional()
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Invalid status"),

      body("role_id").optional().isInt().withMessage("Role id must be integer"),

      body().custom((_, { req }) => {
        const allowed = ["username", "avatar_url", "status", "role_id"];
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
