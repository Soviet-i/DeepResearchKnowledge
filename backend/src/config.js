const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const config = {
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-this",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  storagePath: path.join(__dirname, "..", "storage", "users.json"),
  openAlexBaseUrl: process.env.OPENALEX_BASE_URL || "https://api.openalex.org",
  openAlexEmail: process.env.OPENALEX_EMAIL || "",
  externalSearchTimeoutMs: Number(process.env.EXTERNAL_SEARCH_TIMEOUT_MS || 8000),
};

module.exports = config;
