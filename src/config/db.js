import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

let db;

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
      port: process.env.DB_PORT || 5433,
    }
  );
} else {
  db = new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: process.env.POSTGRES_HOST,
      dialect: "postgres",
      logging: console.log,
      port: process.env.POSTGRES_PORT || 5432, // Ensure this is set if it's different from 5432
      dialectModule: pg,
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Adjust based on your PostgreSQL setup
        },
      },
    }
  );
}

export default db;
