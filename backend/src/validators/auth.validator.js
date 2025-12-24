const { body } = require("express-validator");

class AuthValidator {
  static login() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),

      body("password").notEmpty().withMessage("Password is required"),
    ];
  }

  static register() {
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

      body("name").notEmpty().withMessage("Name is required"),
    ];
  }
}

module.exports = AuthValidator;
