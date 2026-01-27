const path = require("path");
const YAML = require("yamljs");

const swaggerDocument = YAML.load(
  path.join(__dirname, "../../../api-docs/openapi.yml"),
);

module.exports = swaggerDocument;
