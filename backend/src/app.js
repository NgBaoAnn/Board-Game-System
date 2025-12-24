const express = require("express");
const HTTP_STATUS = require("./constants/http-status");
const ResponseHandler = require("./utils/response-handler");
const ErrorHandler = require("./middlewares/error-handler.middleware");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  return ResponseHandler.error(res, {
    status: HTTP_STATUS.NOT_FOUND,
    message: "Route Not Found",
  });
});

app.use(ErrorHandler.handle);

module.exports = app;
