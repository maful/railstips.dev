import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { categoryKeys, useActiveCategories } from '@/hooks/useCategories'
import { useCreateTweet } from '@/hooks/useTweets'
import { Categories } from '@/models/category'
import { LeftArrowIcon } from 'components/icons'
import Alert from 'components/ui/Alert'

function TweetsNew(): JSX.Element {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [tweetId, setTweetId] = React.useState('')
  const [categoryId, setCategoryId] = React.useState('')
  const [active, setActive] = React.useState(true)

  const { isLoading, data: categories } = useActiveCategories({
    initialData: () =>
      queryClient.getQueryData<Categories>(categoryKeys.list('active')) ?? [],
    notifyOnChangeProps: 'tracked',
    refetchOnWindowFocus: false,
  })

  const tweetMutation = useCreateTweet({
    onSuccess: () => {
      queryClient.invalidateQueries('tweets')
    },
  })

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault()
    tweetMutation.mutate({ tweet_id: tweetId, active, category_id: categoryId })
  }

  if (tweetMutation.isSuccess) {
    router.push('/great/tweets')
  }

  if (isLoading) return <h1>Loading Categories...</h1>

  return (
    <div className="px-5 py-10">
      <div className="lg:w-10/12 w-full mx-auto overflow-auto">
        <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
          Create Tweet
        </h2>
        <button onClick={() => router.back()}>
          <div className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0 hover:text-red-800">
            <LeftArrowIcon className="w-4 h-4 mr-2" />
            Back
          </div>
        </button>
        <div className="mt-8 max-w-md">
          <form className="px-4 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {tweetMutation.isError && (
                <Alert>
                  <p className="mx-3">{tweetMutation.error.message}</p>
                </Alert>
              )}

              <label className="block">
                <span className="text-gray-700">Tweet ID</span>
                <input
                  required
                  type="text"
                  value={tweetId}
                  onChange={(e) => setTweetId(e.target.value)}
                  className="mt-2 block form-input w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Category</span>
                <select
                  required
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="block form-select w-full mt-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value=""></option>
                  {categories?.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="block">
                <div className="mt-2">
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => setActive((prevState) => !prevState)}
                        className="form-checkbox rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-offset-0 focus:ring-red-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2">Show this tweet</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="block">
                <div className="text-right">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TweetsNew
