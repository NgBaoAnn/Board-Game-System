const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const swaggerRoute = require("./swagger.route");
const friendRoute = require("../routes/friend.route");
const conversationRoute = require("./conversation.route");
const scoreRoute = require("./score.route");
const gameRoute = require("./game.route");
const achievementRoute = require("./achievement.route");
const authMiddleware = require("../middlewares/auth.middleware");

const initRoute = (app) => {
  app.use("/docs", swaggerRoute);
  app.use("/api/auth", authRoute);
  app.use("/api", scoreRoute);
  app.use("/api", gameRoute);
  app.use("/api", achievementRoute);

  app.use(authMiddleware.authenticate);

  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", conversationRoute);
};

module.exports = initRoute;
