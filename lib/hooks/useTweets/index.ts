import { createTweet, deleteTweet, getTweet, getTweets, updateTweet } from '@/databases/tweets'
import { PostgrestError } from '@/models/commons'
import { FilterTweets, Tweet, Tweets, UpdateTweetForm } from '@/models/tweet'
import {
  useMutation, UseMutationOptions, UseMutationResult, useQuery,
  UseQueryOptions, UseQueryResult,
} from 'react-query'
import tweetKeys from './queries'

function useTweets<TData = Tweets>(
  options?: UseQueryOptions<Tweets, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(tweetKeys.lists(), () => getTweets(), options)
}

function useTweetsFilter<TData = Tweets>(
  filter: FilterTweets = {},
  options?: UseQueryOptions<Tweets, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(tweetKeys.list(filter), () => getTweets(filter), options)
}

function useTweet<TData = Tweet>(
  id: string,
  options?: UseQueryOptions<Tweet, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(tweetKeys.detail(id), () => getTweet(id), options)
}

function useCreateTweet(
  options?: UseMutationOptions<Tweet, PostgrestError, Tweet>
): UseMutationResult<Tweet, PostgrestError, Tweet> {
  return useMutation(createTweet, options)
}

function useUpdateTweet(
  options?: UseMutationOptions<Tweet, PostgrestError, UpdateTweetForm>
): UseMutationResult<Tweet, PostgrestError, UpdateTweetForm> {
  return useMutation(updateTweet, options)
}

function useDeleteTweet(
  options?: UseMutationOptions<Tweet, PostgrestError, string>
): UseMutationResult<Tweet, PostgrestError, string> {
  return useMutation(deleteTweet, options)
}

export {
  tweetKeys,
  useTweets,
  useTweetsFilter,
  useTweet,
  useCreateTweet,
  useUpdateTweet,
  useDeleteTweet
}
