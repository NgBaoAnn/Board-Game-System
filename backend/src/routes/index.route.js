const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const swaggerRoute = require("./swagger.route");
const friendRoute = require("../routes/friend.route");
const conversationRoute = require("./conversation.route");
const gameRoute = require("./game.route");
const uploadRoute = require("./upload.route");
const authMiddleware = require("../middlewares/auth.middleware");
const rankingRoute = require("../routes/ranking.route");
const achievementRoute = require("../routes/achievement.route");
const reviewRoute = require("../routes/review.route");
const dashboardRoute = require("./dashboard.route");

const initRoute = (app) => {
  app.use("/docs", swaggerRoute);
  app.use("/api/auth", authRoute);
  app.use("/api", gameRoute);
  app.use("/api", reviewRoute);
  app.use("/api/upload", uploadRoute);
  app.use("/api", achievementRoute);

  //private route

  app.use(authMiddleware.authenticate);

  app.use("/api", rankingRoute);
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", conversationRoute);
  app.use("/api/dashboard", dashboardRoute);
};

module.exports = initRoute;
