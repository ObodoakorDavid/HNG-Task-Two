import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || "5433",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
);

export default db;
