import React from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
import TweetEmbed from "@/components/TweetEmbed";
import { useTweets } from "@/hooks/useTweets";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useTweets();

  if (status === "loading") {
    return <span>Loading...</span>;
  }

  if (status === "error") {
    return <span>Error</span>;
  }

  return (
    <>
      <Head>
        <title>RailsTips.dev</title>
        <meta
          name="description"
          content="A collection of tips and tricks for the Ruby on Rails ecosystem curated from Twitter"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
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

              <div className="mx-auto max-w-7xl mt-6 px-4 sm:mt-12 sm:px-6 md:mt-12 md:px-16">
                <div className="overflow-x-auto">
                  <ul className="flex flex-row gap-4 my-4 font-medium">
                    <li>
                      <a className="p-3 cursor-pointer text-gray-600 hover:bg-red-500 hover:text-white rounded-lg">
                        ActiveRecord
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
                    {data.pages.map((page) => (
                      <React.Fragment key={page.nextCursor}>
                        {page.data.map((tweet) => (
                          <TweetEmbed
                            key={tweet.tweetId}
                            tweetId={tweet.tweetId}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}
                    >
                      {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                        ? "Give me more"
                        : null}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
