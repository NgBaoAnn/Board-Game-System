require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
  silent: true,
});
const app = require("./app");
const banner = require("./templates/banner-running");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(banner);
});
