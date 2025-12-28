module.exports = {
  config: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  secret: process.env.COOKIE_SECRET,
};
