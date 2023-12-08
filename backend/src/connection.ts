import mysql from "mysql";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export const dbConnectionParams: mysql.ConnectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT!),
  charset: "utf8mb4",
} as mysql.ConnectionConfig;

const db = mysql.createPool(dbConnectionParams);

export default db;
