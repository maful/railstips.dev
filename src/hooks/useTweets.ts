import { useInfiniteQuery } from "@tanstack/react-query";
import type { TweetsResponse } from "@/model/tweet";

const tweetKeys = {
  all: ["tweets"] as const,
  lists: () => [...tweetKeys.all, "list"] as const,
};

const fetchTweets = async ({ pageParam = 0 }): Promise<TweetsResponse> => {
  const response = await fetch(`/api/tweets?nextId=${pageParam}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function useTweets() {
  return useInfiniteQuery({
    queryKey: tweetKeys.lists(),
    queryFn: fetchTweets,
    getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
  });
}
