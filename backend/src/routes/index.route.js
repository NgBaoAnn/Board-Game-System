const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const swaggerRoute = require("./swagger.route");

const initRoute = (app) => {
  app.use("/docs", swaggerRoute);
  app.use("/api/auth", authRoute);
  app.use("/api", userRoute);
};

module.exports = initRoute;
