import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'

import { tweetKeys, useTweet, useUpdateTweet } from '@/hooks/useTweets'
import { LeftArrowIcon } from 'components/icons'
import { TweetForm } from '@/features/Tweets'
import { Tweet } from '@/models/tweet'

function TweetsEdit(): JSX.Element {
  const queryClient = useQueryClient()
  const router = useRouter()
  const id = router.query.id.toString()

  const { data, isLoading } = useTweet(id, { refetchOnWindowFocus: false })

  const tweetMutation = useUpdateTweet({
    onSuccess: (updatedTweet, form) => {
      queryClient.setQueryData(tweetKeys.detail(form.id), updatedTweet)
      queryClient.invalidateQueries(tweetKeys.lists())
    },
  })

  async function handleSubmit(tweet: Tweet): Promise<void> {
    tweetMutation.mutate({ id, tweet: { ...tweet } })
  }

  if (tweetMutation.isSuccess) {
    router.push('/great/tweets')
  }

  return (
    <div className="px-5 py-10">
      <div className="lg:w-10/12 w-full mx-auto overflow-auto">
        <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
          Edit Tweet
        </h2>
        <button onClick={() => router.back()}>
          <div className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0 hover:text-red-800">
            <LeftArrowIcon className="w-4 h-4 mr-2" />
            Back
          </div>
        </button>
        <div className="mt-8 max-w-md">
          {isLoading ? (
            <>Loading...</>
          ) : (
            <TweetForm
              error={tweetMutation.error?.message}
              handleSubmit={handleSubmit}
              tweet={data}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TweetsEdit
