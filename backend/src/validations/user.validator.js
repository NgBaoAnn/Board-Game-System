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
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

      body("name").optional().isString(),
    ];
  }

  static getById() {
    return [param("id").isInt().withMessage("User id must be integer")];
  }
}

module.exports = UserValidator;
