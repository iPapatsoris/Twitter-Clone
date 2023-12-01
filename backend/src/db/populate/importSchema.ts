import mysql from "mysql";
import { dbConnectionParams } from "../../connection.js";
import { readFile } from "fs/promises";
import { runQuery } from "../../util.js";

const importSchema = async () => {
  const connection = mysql.createConnection({
    ...dbConnectionParams,
    multipleStatements: true,
  });
  connection.connect((err) => {
    if (err) {
      throw err;
    }
  });

  const schemaScript = await readFile("src/db/twitter.sql", {
    encoding: "utf8",
  });

  await runQuery(schemaScript, [], connection);
  connection.end();
};

export default importSchema;
