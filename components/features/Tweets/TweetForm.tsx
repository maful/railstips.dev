import * as React from 'react'
import { useQueryClient } from 'react-query'

import { categoryKeys, useActiveCategories } from '@/hooks/useCategories'
import { Categories } from '@/models/category'
import { Tweet } from '@/models/tweet'
import Alert from 'components/ui/Alert'

interface TweetFormProps {
  error?: string
  handleSubmit(tweet: Tweet): Promise<void>
  tweet?: Tweet | null
}

function TweetForm(props: TweetFormProps): JSX.Element {
  const { tweet, handleSubmit, error } = props

  const queryClient = useQueryClient()
  const [tweetId, setTweetId] = React.useState(tweet?.tweet_id ?? '')
  const [categoryId, setCategoryId] = React.useState(tweet?.category_id ?? '')
  const [active, setActive] = React.useState(tweet?.active ?? true)

  const { isLoading, data: categories } = useActiveCategories({
    initialData: () =>
      queryClient.getQueryData<Categories>(categoryKeys.list('active')) ?? [],
    notifyOnChangeProps: 'tracked',
    refetchOnWindowFocus: false,
  })

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleSubmit({
      tweet_id: tweetId,
      category_id: categoryId,
      active,
    })
  }

  if (isLoading) return <h1>Loading Categories...</h1>

  return (
    <>
      <form className="px-4 py-4" onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-6">
          {error && (
            <Alert>
              <p className="mx-3">{error}</p>
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
              defaultValue={categoryId}
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
    </>
  )
}

export default TweetForm
