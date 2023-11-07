import { faker } from "@faker-js/faker";
import { CreateTweet, tweetCharLimit } from "../../api/tweet.js";
import { insertTweet, insertUserReaction } from "../../services/tweet.js";
import { getRandomInt, getRandomIntRange, runQuery } from "../../util.js";

const minUserOriginalTweets = 1;
const maxUserOriginalTweets = 3;
const numberOfReplyPasses = 5;
// Percentage of tweets that receive a reply during each reply pass
const replyPercentage = 80;
const retweetPercentage = 10;
const likePercentage = 70;

export const getAllUserIDs = async () => {
  return await runQuery<{ id: number }>("SELECT id FROM user", []);
};

const getAllTweetIDs = async () => {
  return await runQuery<{ id: number }>("SELECT id FROM tweet", []);
};

const createFakeTweet = (
  referencedTweetID?: number
): CreateTweet["request"]["tweet"] => ({
  text: faker.lorem.paragraphs({ min: 1, max: 5 }).substring(0, tweetCharLimit),
  isReply: referencedTweetID !== undefined,
  referencedTweetID,
});

export const populateTweets = async (userIDs: { id: number }[]) => {
  console.log("Adding tweets");
  for (const userID of userIDs) {
    const numberOfOriginalTweets = getRandomIntRange(
      minUserOriginalTweets,
      maxUserOriginalTweets
    );
    const promises: Promise<number>[] = [];
    for (let t = 0; t < numberOfOriginalTweets; t++) {
      const tweet = createFakeTweet();
      promises.push(insertTweet(tweet, userID.id));
    }
    await Promise.all(promises);
  }
};

export const populateReplies = async (userIDs: { id: number }[]) => {
  console.log("Adding replies");
  for (let pass = 0; pass < numberOfReplyPasses; pass++) {
    console.log("\t pass ", pass + 1);

    const tweetIDs = await getAllTweetIDs();
    const numberOfTweetsToBeReplied = Math.floor(
      (replyPercentage * tweetIDs.length) / 100
    );

    for (let t = 0; t < numberOfTweetsToBeReplied; t++) {
      const replyAuthor = userIDs[getRandomInt(userIDs.length)].id;
      const replyTarget = tweetIDs[getRandomInt(tweetIDs.length)].id;
      const reply = createFakeTweet(replyTarget);
      await insertTweet(reply, replyAuthor);
    }
  }
};

export const populateRetweets = async (userIDs: { id: number }[]) =>
  await populateRetweetsOrLikes(true, userIDs);
export const populateLikes = async (userIDs: { id: number }[]) =>
  await populateRetweetsOrLikes(false, userIDs);

const populateRetweetsOrLikes = async (
  forRetweets: boolean,
  userIDs: { id: number }[]
) => {
  console.log("Adding ", forRetweets ? "retweets" : "likes");

  const tweetIDs = await getAllTweetIDs();
  const iterations = Math.floor(
    ((forRetweets ? retweetPercentage : likePercentage) * tweetIDs.length) / 100
  );
  for (let iteration = 0; iteration < iterations; iteration++) {
    const userID = userIDs[getRandomInt(userIDs.length)].id;
    const tweetID = tweetIDs[getRandomInt(tweetIDs.length)].id;
    await insertUserReaction(tweetID, userID, forRetweets ? "retweet" : "like");
  }
};
