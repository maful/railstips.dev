import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";
import type { TweetsResponse } from "@/model/tweet";

const tweetKeys = {
  all: ["tweets"] as const,
  lists: () => [...tweetKeys.all, "list"] as const,
  byCategory: (id: number) => [...tweetKeys.lists(), { categoryId: id }],
};

const fetchTweets = async ({
  pageParam = 0,
  meta = {},
}: QueryFunctionContext): Promise<TweetsResponse> => {
  const categoryId = (meta["categoryId"] as number) ?? 0;
  console.log("keys", categoryId);
  const response = await fetch(
    `/api/tweets?nextId=${pageParam}&categoryId=${categoryId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useTweets(categoryId: number) {
  return useInfiniteQuery({
    queryKey: tweetKeys.byCategory(categoryId),
    queryFn: (params) =>
      fetchTweets({ ...params, meta: { ...params.meta, categoryId } }),
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  });
}
