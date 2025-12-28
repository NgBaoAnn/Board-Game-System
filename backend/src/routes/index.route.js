const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const swaggerRoute = require("./swagger.route");
const friendRoute = require("../routes/friend.route");
const conversationRoute = require("./conversation.route");
const scoreRoute = require("./score.route");
const authMiddleware = require("../middlewares/auth.middleware");

const initRoute = (app) => {
  app.use("/docs", swaggerRoute);
  app.use("/api/auth", authRoute);

  app.use(authMiddleware.authenticate);

  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", conversationRoute);
  app.use("/api", scoreRoute);
};

module.exports = initRoute;
