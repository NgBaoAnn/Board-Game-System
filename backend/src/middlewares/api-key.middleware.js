const HTTP_STATUS = require("../constants/http-status");

const apiKeyMiddleware = (req, res, next) => {
  // Bypass for /docs routes - they use login authentication only
  if (req.path.startsWith("/docs")) {
    return next();
  }

  // Support API key from header OR query parameter (for browser access)
  const apiKey = req.headers["x-api-key"] || req.query["api-key"];
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: "Forbidden: Invalid or missing API Key",
    });
  }

  next();
};

module.exports = apiKeyMiddleware;
