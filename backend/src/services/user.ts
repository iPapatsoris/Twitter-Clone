import { runQuery } from "../util.js";

export const usernameExists = async (username: string) => {
  const count = (
    await runQuery<{ count: number }>(
      "SELECT count(*) as count FROM user WHERE username = ?",
      [username]
    )
  )[0].count;
  return count > 0;
};
