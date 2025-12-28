const { validationResult } = require("express-validator");
const ValidateError = require("../errors/validate.exception");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new ValidateError(
        errors.array().map((e) => ({
          message: e.msg,
        }))
      )
    );
  }
  next();
};
