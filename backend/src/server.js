require("dotenv").config();
const app = require("./app");
const banner = require("./templates/banner-running");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(banner);
});
