module.exports = {
  secret: process.env.JWT_SECRET,
  accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};
