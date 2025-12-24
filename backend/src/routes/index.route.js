const authRoute = require("./auth.route");
const userRoute = require("./user.route");

const initRoute = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api", userRoute);
};

module.exports = initRoute;
