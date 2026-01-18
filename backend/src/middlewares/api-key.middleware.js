const HTTP_STATUS = require("../constants/http-status");

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: "Forbidden: Invalid or missing API Key",
    });
  }

  next();
};

module.exports = apiKeyMiddleware;
