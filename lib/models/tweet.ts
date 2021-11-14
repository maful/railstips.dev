interface ExtendCategory {
  categories?: {
    name: string;
  };
}

interface BasicTweet {
  id?: string;
  tweet_id: string;
  active: boolean;
  category_id: string;
  created_at?: Date;
}

export interface UpdateTweetForm {
  id: string;
  tweet: BasicTweet;
}

export interface Tweet extends BasicTweet, ExtendCategory {}


export interface FilterTweets {
  categoryId?: string;
}

export type Tweets = Tweet[]
