import type { Tweet } from "@prisma/client";

export type PublicTweets = Array<Pick<Tweet, "id" | "tweetId">>;

export type TweetsResponse = {
  data: PublicTweets;
  nextId: number | null;
};
