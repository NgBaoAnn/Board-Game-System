const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const swaggerRoute = require("./swagger.route");
const friendRoute = require("../routes/friend.route");
const conversationRoute = require("./conversation.route");
const gameRoute = require("./game.route");
const uploadRoute = require("./upload.route");
const authMiddleware = require("../middlewares/auth.middleware");
const rankingRoute = require("../routes/ranking.route");

const initRoute = (app) => {
  app.use("/docs", swaggerRoute);
  app.use("/api/auth", authRoute);
  app.use("/api", gameRoute);
  app.use("/api/upload", uploadRoute);

  //private route

  app.use(authMiddleware.authenticate);

  app.use("/api", rankingRoute);
  app.use("/api", userRoute);
  app.use("/api", friendRoute);
  app.use("/api", conversationRoute);
};

module.exports = initRoute;
