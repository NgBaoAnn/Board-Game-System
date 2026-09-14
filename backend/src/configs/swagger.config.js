const path = require("path");
const fs = require("fs");
const YAML = require("yamljs");

const candidatePaths = [
  path.join(__dirname, "../../../api-docs/openapi.yml"),
  "/api-docs/openapi.yml",
  path.join(__dirname, "../../api-docs/openapi.yml"),
  path.join(process.cwd(), "api-docs/openapi.yml"),
  path.join(process.cwd(), "../api-docs/openapi.yml"),
];

let swaggerDocument = {};
for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    try {
      swaggerDocument = YAML.load(p);
      break;
    } catch (e) {
      console.error(`Error loading swagger from ${p}:`, e.message);
    }
  }
}

module.exports = swaggerDocument;
