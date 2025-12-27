const path = require("path");
const YAML = require("yamljs");

const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yml"));

module.exports = swaggerDocument;
