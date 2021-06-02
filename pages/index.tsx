import Head from 'next/head'
import { Tweet } from 'react-twitter-widgets'
import Tabs from '../components/Tabs'
import TweetEmbed from '../components/TweetEmbed'

const categories = ['ActiveRecord', 'ActiveSupport', 'ActiveJob', 'Others']

export default function Home() {
  return (
    <div>
      <Head>
        <title>Rails Tips</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">

            <div>
              <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block text-red-600 xl:inline">Rails</span>
                  <span className="block xl:inline">Tips</span>
                </h1>
                <div>Find the most useful tips & tricks.</div>
              </div>
            </div>

            <main className="mt-8 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <Tabs
                activeTab={0}
                categories={['All', ...categories]}
              />
              <div className="sm:text-center lg:text-left">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <TweetEmbed tweetId="1398627350758232064" />
                  </div>
                  <div>
                    <TweetEmbed tweetId="1396119327171125250" />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

    </div>
  )
}
