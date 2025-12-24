const AppError = require("./app.error");

class ValidateError extends AppError {
  constructor(errors) {
    super("Validation failed", 422, errors);
  }
}

module.exports = ValidateError;
