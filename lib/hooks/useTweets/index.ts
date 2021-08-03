import { createTweet, deleteTweet, getTweet, getTweets } from '@/databases/tweets'
import { PostgrestError } from '@/models/commons'
import { Tweet, Tweets } from '@/models/tweet'
import {
  useMutation, UseMutationOptions, UseMutationResult, useQuery,
  UseQueryOptions, UseQueryResult,
} from 'react-query'
import tweetKeys from './queries'

function useTweets<TData = Tweets>(
  options?: UseQueryOptions<Tweets, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(tweetKeys.lists(), getTweets, options)
}

function useTweet(id: string): UseQueryResult<Tweet, Error> {
  return useQuery(['tweet', id], () => getTweet(id))
}

function useCreateTweet(
  options?: UseMutationOptions<Tweet, PostgrestError, Tweet>
): UseMutationResult<Tweet, PostgrestError, Tweet> {
  return useMutation(createTweet, options)
}

function useDeleteTweet(
  options?: UseMutationOptions<Tweet, PostgrestError, string>
): UseMutationResult<Tweet, PostgrestError, string> {
  return useMutation(deleteTweet, options)
}

export {
  tweetKeys,
  useTweets,
  useTweet,
  useCreateTweet,
  useDeleteTweet
}
