require("dotenv").config();

const connection = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "boardgame",
      ssl: false,
    };

module.exports = {
  development: {
    client: "pg",
    connection,
    pool: { min: 0, max: 3 },
    migrations: {
      directory: "./src/databases/migrations",
    },
    seeds: {
      directory: "./src/databases/seeds",
    },
  },
  production: {
    client: "pg",
    connection,
    pool: { min: 0, max: 10 },
    migrations: {
      directory: "./src/databases/migrations",
    },
    seeds: {
      directory: "./src/databases/seeds",
    },
  },
};
