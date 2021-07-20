import React from 'react'
import Head from 'next/head'
import { Tweet as TweetEmbed } from 'react-twitter-widgets'
import axios, { AxiosResponse } from 'axios'
import { Tabs, Footer } from 'components'
import { Tweet } from 'models/tweet'
import { Category } from 'models/category'

interface TweetsResponse {
  tweets: Tweet[]
}

interface CategoriesResponse {
  categories: Category[]
}

export default function Home(): JSX.Element {
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<string>('0')
  const [tweets, setTweets] = React.useState<Tweet[]>(null)
  const [categories, setCategories] = React.useState<Category[]>(null)

  React.useEffect(() => {
    const fetchInitialTweets = async () => {
      const response: AxiosResponse<TweetsResponse> = await axios.get('/api/tweets?category=all')
      setTweets(response.data.tweets)
    }

    const fetchCategories = async () => {
      const response: AxiosResponse<CategoriesResponse> = await axios.get('/api/categories')
      setCategories(response.data.categories)
    }

    fetchInitialTweets()
    fetchCategories()
  }, [])

  async function handleTabChange(id: string): Promise<void> {
    setLoading(true)
    setActiveTab(id)

    const category_id = id === '0' ? 'all' : id
    const response: AxiosResponse<TweetsResponse> = await axios.get(
      `/api/tweets?category=${category_id}`
    )
    setTweets(response.data.tweets)

    setLoading(false)
  }

  return (
    <div>
      <Head>
        <title>RailsTips - Find the most useful tips &amp; tricks</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Find the most useful tips &amp; tricks to make your code better"
        />
        <meta property="og:title" content="Ruby on Rails Tips" />
        <meta
          property="og:description"
          content="Find the most useful tips &amp; tricks to make your code better"
        />
        <meta
          property="og:image"
          content="https://railstips.dev/og-image.jpeg"
        />
        <meta property="og:url" content="https://railstips.dev/" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div>
              <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="md:block text-red-600 xl:inline">Rails</span>
                  <span className="md:block xl:inline">Tips</span>
                </h1>
                <div className="mt-2">
                  Find the most useful tips &amp; tricks
                </div>
              </div>
            </div>

            <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="overflow-x-auto">
                <Tabs
                  activeTab={activeTab}
                  categories={categories}
                  onChange={handleTabChange}
                />
              </div>
              <div className="sm:text-center lg:text-left">
                {loading ? (
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
                    {tweets &&
                      tweets.map((tweet) => (
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
