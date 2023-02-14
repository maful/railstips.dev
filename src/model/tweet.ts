import type { Tweet } from "@prisma/client";

export type SingleTweet = Pick<Tweet, "id" | "tweetId" | "categoryId">;
export type PublicTweets = SingleTweet[];
export type TweetsResponse = {
  data: PublicTweets;
  nextId: number | null;
};
export type TweetCreate = Pick<Tweet, "tweetId" | "categoryId">;
