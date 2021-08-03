export interface Tweet {
  id?: string;
  tweet_id: string;
  active: boolean;
  category_id: string;
  created_at?: Date;
  categories?: {
    name: string;
  };
}

export type Tweets = Tweet[]
