const express = require("express");
const HTTP_STATUS = require("./constants/http-status");
const ResponseHandler = require("./utils/response-handler");
const ErrorHandler = require("./middlewares/error-handler.middleware");
const initRoute = require("./routes/index.route");
const app = express();
const cors = require("cors");
const corsConfig = require("./configs/cors.config");
const cookieParser = require("cookie-parser");
const cookieConfig = require("./configs/cookie.config");

app.use(cors(corsConfig));
app.use(cookieParser(cookieConfig.secret));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initRoute(app);

app.use((req, res, next) => {
  return ResponseHandler.error(res, {
    status: HTTP_STATUS.NOT_FOUND,
    message: "Route Not Found",
  });
});

app.use(ErrorHandler.handle);

module.exports = app;
