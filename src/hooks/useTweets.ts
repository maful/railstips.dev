import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { SingleTweet, TweetCreate, TweetsResponse } from "@/model/tweet";

export const tweetKeys = {
  all: ["tweets"] as const,
  lists: () => [...tweetKeys.all, "list"] as const,
  byCategory: (id: number) => [...tweetKeys.lists(), { categoryId: id }],
};

const fetchTweets = async ({
  pageParam = 0,
  meta = {},
}: QueryFunctionContext): Promise<TweetsResponse> => {
  const categoryId = (meta["categoryId"] as number) ?? 0;
  const response = await fetch(
    `/api/tweets?nextId=${pageParam}&categoryId=${categoryId}`
  );
  if (!response.ok) {
    throw new Error("Failed to get tweets");
  }
  return response.json();
};

const createTweet = async (data: TweetCreate): Promise<SingleTweet> => {
  const response = await fetch("/api/tweets/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await response.json();

  if (!response.ok) {
    if (response.status === 422) {
      throw new Error(body.error);
    } else {
      throw new Error("failed to create tweet");
    }
  }

  return body;
};

export function useTweets(categoryId: number) {
  return useInfiniteQuery({
    queryKey: tweetKeys.byCategory(categoryId),
    queryFn: (params) =>
      fetchTweets({ ...params, meta: { ...params.meta, categoryId } }),
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  });
}

export function useCreateTweet() {
  return useMutation<SingleTweet, Error, TweetCreate>({
    mutationFn: (newTweet: TweetCreate) => createTweet(newTweet),
  });
}
