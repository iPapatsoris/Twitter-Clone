import moment, { Moment } from "moment";
import { Tweet } from "../../../../backend/src/entities/tweet";

// TODO: group exported variables into one
const totalTweets = 55;
const startingTweetID = 1000;
let date = moment();
const formatDate = (date: Moment) => date.format("YYYY-MM-DD hh:mm:ss");
const tweetTextFormat = "This is the text of tweet ID ";

// Past tweets in reverse chronological order
const mockedTimeline: Tweet[] = [];

for (let id = startingTweetID; id < startingTweetID + totalTweets; id++) {
  const tweet: Tweet = {
    id,
    text: tweetTextFormat + id,
    isReply: false,
    creationDate: formatDate(date.subtract(1, "month")),
    replyDepth: 0,
    rootTweetID: id,
    isLiked: false,
    isRetweeted: false,
    stats: { views: 100, totalLikes: 15, totalReplies: 0, totalRetweets: 5 },
    author: {
      id: 1,
      name: "one",
      username: "username1 ",
      isVerified: true,
    },
  };

  mockedTimeline.push(tweet);
}

export const tweetTestData = {
  mockedTimeline,
  startingTweetID,
  tweetTextFormat,
};
