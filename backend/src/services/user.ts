/* eslint-disable no-multi-str */
import { Response } from "express";
import { sha256 } from "js-sha256";
import { NormalResponse, extraQueryFields } from "../api/common.js";
import ErrorCodes from "../api/errorCodes.js";
import { GetUser, GetUserFollowers, UserResponse } from "../api/user.js";
import { User } from "../entities/user.js";
import { checkPermissions, GetUserFields } from "../permissions.js";
import { removeArrayFields, runQuery } from "../util.js";
import { getTotalUserTweets } from "./tweet.js";
import { SessionData } from "../middleware/auth.js";

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
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const hash = sha256(password);
  const user = (
    await runQuery<User>(
      "SELECT id, name, username, avatar FROM user WHERE username = ? AND password = ?",
      [username, hash]
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

export const getUser = async ({
  username,
  views,
  session,
  getIsFollowedByActiveUser,
  getTotalFollowees,
  getTotalFollowers,
  getTotalTweets,
}: {
  username: string;
  views: string[];
  session: Partial<SessionData>;
  getTotalFollowees: boolean;
  getTotalFollowers: boolean;
  getTotalTweets: boolean;
  getIsFollowedByActiveUser: boolean;
}): Promise<Omit<GetUser<GetUserFields>["response"], "isLoggedOut">> => {
  // Query regular fields
  const [user] = await runQuery<UserResponse<GetUserFields>>(
    "SELECT id" + views.join("") + " FROM user WHERE username = ?",
    [username]
  );

  if (!user) {
    return { ok: false };
  }
  const { id: userID } = user;

  if (getTotalTweets) {
    user.totalTweets = await getTotalUserTweets(Number(userID));
  }
  if (getTotalFollowers || getTotalFollowees) {
    // Query friendship fields
    const totalFollowersQuery =
      "SELECT COUNT(*) as totalFollowers \
         FROM user_follows as friendship \
         WHERE friendship.followeeID = ?";
    const totalFolloweesQuery =
      "SELECT COUNT(*) as totalFollowees \
         FROM user_follows as friendship \
         WHERE friendship.followerID = ?";

    if (getTotalFollowees) {
      user.totalFollowees = (
        await runQuery<{ totalFollowees: number }>(totalFolloweesQuery, [
          userID,
        ])
      )[0].totalFollowees;
    }

    if (getTotalFollowers) {
      user.totalFollowers = (
        await runQuery<{ totalFollowers: number }>(totalFollowersQuery, [
          userID,
        ])
      )[0].totalFollowers;
    }
  }

  user.isFollowedByActiveUser = false;

  if (session && session.isLoggedIn && getIsFollowedByActiveUser) {
    const activeUserID = session && session.userID;
    user.isFollowedByActiveUser = await checkUserFollowedByActiveUser(
      userID,
      activeUserID!
    );
  }

  return { ok: true, data: { user: user } };
};

export const prepareUserQuery = ({
  fields,
}: {
  fields: GetUserFields[];
  res: Response<any>;
}): NormalResponse<{
  getTotalFollowers: boolean;
  getTotalFollowees: boolean;
  getTotalTweets: boolean;
  getIsFollowedByActiveUser: boolean;
  views: string[];
}> => {
  // Make sure request has included some fields to query about
  if (!fields.length) {
    return { ok: false, errorCode: ErrorCodes.NoFieldsSpecified };
  }

  // Allow only whitelisted fields
  if (!checkPermissions("GetUser", fields)) {
    console.log("Failed permissions test");
    return { ok: false, errorCode: ErrorCodes.PermissionDenied };
  }

  // Remove parameters that are not direct user properties, but will
  // be retrived by separate queries. Also remove extra generic query options.
  const seperatedFields = removeArrayFields<(typeof fields)[0]>(fields, [
    "totalFollowees",
    "totalFollowers",
    "totalTweets",
    "isFollowedByActiveUser",
    ...extraQueryFields,
  ]);

  // Set flags for seperate fields to query
  let getTotalFollowees = false;
  let getTotalFollowers = false;
  let getTotalTweets = false;
  let getIsFollowedByActiveUser = false;
  seperatedFields.forEach((field) => {
    if (field === "totalFollowees") {
      getTotalFollowees = true;
    } else if (field === "totalFollowers") {
      getTotalFollowers = true;
    } else if (field === "totalTweets") {
      getTotalTweets = true;
    } else if (field === "isFollowedByActiveUser") {
      getIsFollowedByActiveUser = true;
    }
  });

  // Adjust query fields to select
  const views = fields.map((f) => ",user." + f);
  return {
    ok: true,
    data: {
      getTotalFollowees,
      getTotalFollowers,
      getTotalTweets,
      getIsFollowedByActiveUser,
      views,
    },
  };
};

type GetUserResponseData = GetUser<GetUserFields>["response"]["data"];
export const getUserCircle = async ({
  query,
  username,
  session,
  optionsResult,
}: {
  query: string;
  username: string;
  session: Partial<SessionData>;
  optionsResult: ReturnType<typeof prepareUserQuery>;
}): Promise<
  NormalResponse<Array<NonNullable<GetUserResponseData>["user"]>>
> => {
  const followerIDs = await runQuery<{ username: string }>(query, [username]);
  const promises = followerIDs.map(({ username: followerUsername }) =>
    getUser({
      username: followerUsername,
      session: session,
      ...optionsResult.data!,
    })
  );
  const followersResults = await Promise.all(promises);

  const followers: NonNullable<
    GetUserFollowers<GetUserFields>["response"]["data"]
  >["followers"] = [];

  for (let i = 0; i < followersResults.length; i++) {
    const followerResult = followersResults[i];
    if (!followerResult.ok) {
      return { ok: false, errorCode: followerResult.errorCode };
    }
    followers.push(followerResult.data?.user!);
  }

  return { ok: true, data: followers };
};

export const friendshipExists = async ({
  followerID,
  followeeID,
}: {
  followerID: number;
  followeeID: number;
}) => {
  const [friendship] = await runQuery<{ id: number }>(
    "SELECT id FROM user_follows WHERE followerID = ? AND followeeID = ?",
    [followerID, followeeID]
  );
  return friendship;
};

export const addFollower = async ({
  followerID,
  followeeID,
}: {
  followerID: number;
  followeeID: number;
}) => {
  if (
    followerID === followeeID ||
    (await friendshipExists({ followeeID, followerID }))
  ) {
    return false;
  }

  await runQuery(
    "INSERT INTO user_follows (followerID, followeeID) VALUES (?, ?)",
    [followerID, followeeID]
  );

  return true;
};

export const getUsernameFromID = async (id: number) => {
  const [res] = await runQuery<{ username: string }>(
    "SELECT username FROM user WHERE id = ?",
    [id]
  );
  return res.username;
};

export const getUserIDFromUsername = async (username: string) => {
  const [res] = await runQuery<{ id: number }>(
    "SELECT id FROM user WHERE username = ?",
    [username]
  );
  return res.id;
};
