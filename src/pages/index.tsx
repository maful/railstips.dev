import { useState, Fragment } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useScrollContainer } from "react-indiana-drag-scroll";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { tweetKeys, useCreateTweet, useTweets } from "@/hooks/useTweets";
import { useCategories } from "@/hooks/useCategories";
import { Tabs, TweetEmbed, Footer } from "@/components";
import type { TweetCreate } from "@/model/tweet";

const inter = Inter({ subsets: ["latin"] });

const notifyAdded = () =>
  toast.success("Tweet successfully added!", { duration: 3_000 });

export default function Home() {
  const queryClient = useQueryClient();
  const scrollContainer = useScrollContainer();
  const { status: sessionStatus, data: sessionData } = useSession();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const categoriesQuery = useCategories();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useTweets(activeCategory);
  const createTweetMutation = useCreateTweet();
  const {
    register,
    handleSubmit,
    reset: resetForm,
    setError,
    formState: { errors },
  } = useForm<TweetCreate>();

  const onSubmitTweet: SubmitHandler<TweetCreate> = async (data) => {
    createTweetMutation.mutate(data, {
      onSuccess: (newTweet) => {
        queryClient.invalidateQueries({
          queryKey: tweetKeys.byCategory(newTweet.categoryId),
        });

        if (activeCategory === 0) {
          queryClient.invalidateQueries({
            queryKey: tweetKeys.byCategory(0),
          });
        }

        closeModal();
        notifyAdded();
      },
      onError: (e) => {
        setError("tweetId", { type: "custom", message: e.message });
      },
    });
  };

  const handleCategory = (id: number) => {
    setActiveCategory(id);
  };

  const closeModal = () => {
    resetForm();
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
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
        <link href="/favicon.svg" type="image/svg+xml" rel="shortcut icon" />
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
            <div className="relative z-10 bg-white pb-16 md:pb-20 lg:w-full">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 px-6 md:px-16 pt-6">
                <div className="flex-1 relative">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="inline text-red-600">Rails</span>
                    <span className="inline">Tips</span>
                  </h1>
                  <div className="mt-2">
                    A collection of tips and tricks for the Ruby on Rails
                    ecosystem curated from Twitter
                  </div>
                </div>
                <div>
                  <div className="flex gap-6 md:gap-8 items-center justify-end">
                    {sessionStatus === "unauthenticated" ? (
                      <button
                        type="button"
                        className="rounded-lg border border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200"
                        onClick={() => signIn("github")}
                      >
                        Sign in
                      </button>
                    ) : sessionStatus === "authenticated" ? (
                      <>
                        <button
                          type="button"
                          onClick={openModal}
                          className="rounded-lg border border-red-100 bg-red-100 px-5 py-2.5 text-center text-sm font-medium text-red-600 transition-all hover:border-red-200 hover:bg-red-200 focus:ring focus:ring-red-50 disabled:border-red-50 disabled:bg-red-50 disabled:text-red-400"
                        >
                          Add tweet
                        </button>
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button>
                              <div className="flex gap-2 items-center">
                                <Image
                                  src={
                                    sessionData.user?.image ??
                                    `https://ui-avatars.com/api/?name=${
                                      sessionData.user?.name ?? "Avatar"
                                    }&size=128&rounded=true`
                                  }
                                  alt={sessionData.user?.name ?? "Avatar"}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-400"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                              <div className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative h-10 w-10">
                                    <Image
                                      src={
                                        sessionData.user?.image ??
                                        `https://ui-avatars.com/api/?name=${
                                          sessionData.user?.name ?? "Avatar"
                                        }&size=128&rounded=true`
                                      }
                                      alt={sessionData.user?.name ?? "Avatar"}
                                      width={40}
                                      height={40}
                                      className="rounded-full object-cover object-center ring ring-white"
                                    />
                                  </div>
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-700">
                                      {sessionData.user?.name}
                                    </div>
                                    <div className="text-gray-400">
                                      {sessionData.user?.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-1">
                                <Menu.Item key="signout" as={Fragment}>
                                  {({ active }) => (
                                    <button
                                      type="button"
                                      className={`${
                                        active
                                          ? "bg-gray-100 text-gray-700"
                                          : "text-gray-900"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      onClick={() =>
                                        signOut({ redirect: false })
                                      }
                                    >
                                      Sign out
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <hr className="mt-6 md:hidden h-px border-0 bg-gray-300" />
              <div className="mx-auto max-w-7xl mt-12 px-6 md:mt-10 md:px-16">
                <div
                  className="overflow-x-auto mb-4 hide-scroll"
                  ref={scrollContainer.ref}
                >
                  <Tabs
                    query={categoriesQuery}
                    onTabChange={handleCategory}
                    activeId={activeCategory}
                  />
                </div>

                {status === "loading" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 animate-pulse">
                    {[...Array(6)].map((_el, i) => (
                      <div
                        key={i}
                        className="h-48 w-full bg-slate-200 rounded"
                      ></div>
                    ))}
                  </div>
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
                    <div className="flex justify-center mt-8">
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
              <Footer />
            </div>
          </div>
        </div>
      </main>
      <Transition appear show={modalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="relative p-6">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add new tips and tricks from Twitter
                    </Dialog.Title>
                    <form
                      onSubmit={handleSubmit(onSubmitTweet)}
                      id="tweetForm"
                      className="mt-4 space-y-5"
                    >
                      <div>
                        <label
                          htmlFor="tweetId"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Tweet ID
                        </label>
                        <input
                          {...register("tweetId", { required: true })}
                          className="form-input block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        {errors.tweetId ? (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.tweetId.message
                              ? errors.tweetId.message
                              : "Tweet ID is required"}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label
                          htmlFor="categoryId"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          Category
                        </label>
                        <select
                          {...register("categoryId", { required: true })}
                          className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          defaultValue={""}
                        >
                          <option value="" disabled>
                            Choose category
                          </option>
                          {(categoriesQuery.data ?? []).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.categoryId ? (
                          <p className="mt-1 text-sm text-red-500">
                            Category is required
                          </p>
                        ) : null}
                      </div>
                    </form>
                  </div>

                  <div className="mt-4 flex justify-end gap-3 bg-gray-50 px-6 py-3">
                    <button
                      type="button"
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-500 bg-red-500 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200"
                      form="tweetForm"
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Toaster />
    </>
  );
}
