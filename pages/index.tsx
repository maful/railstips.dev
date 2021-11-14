import React from 'react'
import { Tweet as TweetEmbed } from 'react-twitter-widgets'
import { Tabs, Footer } from 'components'
import { FilterTweets } from '@/models/tweet'
import { useTweetsFilter } from '@/hooks/useTweets'
import { useActiveCategories } from '@/hooks/useCategories'
import { Category } from '@/models/category'

export default function Home(): JSX.Element {
  const [filters, setFilters] = React.useState<FilterTweets>({ categoryId: 'all' })
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<string>('0')
  const {
    isLoading,
    data: tweets,
  } = useTweetsFilter(filters, { notifyOnChangeProps: 'tracked' })
  const { data: categories } = useActiveCategories({ initialData: () => [], notifyOnChangeProps: 'tracked' })

  async function handleTabChange(id: string): Promise<void> {
    setLoading(true)
    setActiveTab(id)

    const categoryId = id === '0' ? 'all' : id
    setFilters({ categoryId })

    setLoading(false)
  }

  const firstCategory: Category = {
    id: '0',
    rank: 1,
    name: 'All',
    active: true
  }

  return (
    <div>
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div>
              <div className="relative pt-6 px-4 sm:px-6 md:px-16">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="inline text-red-600">Rails</span>
                  <span className="inline">Tips</span>
                </h1>
                <div className="mt-2">
                  Find the most useful tips &amp; tricks
                </div>
              </div>
            </div>

            <main className="mx-auto max-w-7xl mt-6 px-4 sm:mt-12 sm:px-6 md:mt-12 md:px-16">
              <div className="overflow-x-auto">
                <Tabs
                  activeTab={activeTab}
                  categories={[firstCategory, ...categories]}
                  onChange={handleTabChange}
                />
              </div>
              <div className="sm:text-center lg:text-left">
                {loading || isLoading ? (
                  <svg
                    className="animate-spin h-8 w-8 my-0 mx-auto text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
                    {tweets.map((tweet) => (
                      <div key={tweet.id}>
                        <TweetEmbed tweetId={tweet.tweet_id} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}
