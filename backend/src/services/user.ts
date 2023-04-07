/* eslint-disable no-multi-str */
import { sha256 } from "js-sha256";
import { User } from "../entities/user.js";
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

export const checkCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const hash = sha256(password);
  const user = (
    await runQuery<User>(
      "SELECT id, name, username, avatar FROM user WHERE email = ? AND password = ?",
      [email, hash]
    )
  )[0];

  return user;
};

export const checkUserFollowedByActiveUser = async (
  userID: number,
  activeUserID: number
) => {
  const [{ count }] = await runQuery<{ count: number }>(
    "SELECT count(*) AS count FROM user_follows AS friendship \
     WHERE friendship.followeeID = ? AND friendship.followerID = ?",
    [userID, activeUserID]
  );
  return count > 0;
};
