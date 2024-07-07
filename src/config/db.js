import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

let db;

if (process.env.NODE_ENV === "development") {
  db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: "localhost",
      dialect: "postgres",
      port: process.env.DB_PORT || "5432",
    }
  );
} else {
  db = new Sequelize(process.env.POSTGRES_URL, {
    dialectModule: pg,
  });
}

export default db;
