import mysql from "mysql";
const host = "localhost";
const user = "root";
const database = "twitter";

const db = mysql.createConnection({
  host,
  user,
  database,
  charset: "utf8mb4",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

export default db;
