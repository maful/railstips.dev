import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { TweetsResponse } from "@/model/tweet";

const tweetKeys = {
  all: ["tweets"] as const,
  lists: () => [...tweetKeys.all, "list"] as const,
  byCategory: (categoryId: string) =>
    [...tweetKeys.lists(), "category", categoryId] as const,
};

const fetchTweets = async ({ pageParam = 0 }): Promise<TweetsResponse> => {
  const response = await fetch(`/api/tweets?cursorId=${pageParam}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useTweets() {
  return useInfiniteQuery({
    queryKey: ["tweets"],
    queryFn: fetchTweets,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
