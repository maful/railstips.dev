import { useState, Fragment } from "react";
import Head from "next/head";
import { Inter } from "@next/font/google";
import { useTweets } from "@/hooks/useTweets";
import { useCategories } from "@/hooks/useCategories";
import TweetEmbed from "@/components/TweetEmbed";
import Tabs from "@/components/Tabs";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const categoriesQuery = useCategories();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useTweets(activeCategory);
  const handleCategory = (id: number) => {
    setActiveCategory(id);
  };

  const meta = {
    title: "RailsTips - A collection of tips and tricks for the Ruby on Rails",
    description:
      "A collection of tips and tricks for the Ruby on Rails ecosystem curated from Twitter",
    cardImage: "/og-image.jpeg",
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta name="description" content={meta.description} />
        <meta property="og:url" content={`https://railstips.dev`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta
          property="og:image"
          content={`https://railstips.dev${meta.cardImage}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@railstips_dev" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta
          name="twitter:image"
          content={`https://railstips.dev${meta.cardImage}`}
        />
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

              <div className="mx-auto max-w-7xl mt-12 px-6 md:mt-10 md:px-16">
                <div className="overflow-x-auto mb-4">
                  <Tabs
                    query={categoriesQuery}
                    onTabChange={handleCategory}
                    activeId={activeCategory}
                  />
                </div>

                {status === "loading" ? (
                  <span>Loading...</span>
                ) : status === "error" ? (
                  <span>Unable to load tweets</span>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4">
                      {data.pages.map((page) => (
                        <Fragment key={page.nextId}>
                          {page.data.map((tweet) => (
                            <TweetEmbed
                              key={tweet.tweetId}
                              tweetId={tweet.tweetId}
                            />
                          ))}
                        </Fragment>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      {hasNextPage ? (
                        <button
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                          onClick={() => fetchNextPage()}
                          disabled={!hasNextPage || isFetchingNextPage}
                        >
                          {isFetchingNextPage ? (
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                strokeWidth={4}
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          ) : null}

                          {isFetchingNextPage
                            ? "Loading magic..."
                            : hasNextPage
                            ? "Bringing in more"
                            : null}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
