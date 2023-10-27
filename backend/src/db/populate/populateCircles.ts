import { addFollower } from "../../services/user.js";
import { getRandomInt, getRandomIntRange } from "../../util.js";

export const populateCircles = async (userIDs: { id: number }[]) => {
  console.log("Adding circles");

  const minUserFollowees = 1;
  const maxUserFollowees = 15;

  for (const { id: followerID } of userIDs) {
    const totalFollowees = getRandomIntRange(
      minUserFollowees,
      maxUserFollowees
    );
    for (let iteration = 0; iteration < totalFollowees; iteration++) {
      const followeeID = userIDs[getRandomInt(userIDs.length)].id;
      await addFollower({
        followerID,
        followeeID,
      });
    }
  }
};
