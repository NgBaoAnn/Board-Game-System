const AppError = require("./app.error");

class DuplicateError extends AppError {
  constructor(message = "Duplicate data") {
    super(message, 409);
  }
}

module.exports = DuplicateError;
