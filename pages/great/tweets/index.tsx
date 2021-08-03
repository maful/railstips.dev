import * as React from 'react'
import Link from 'next/link'
import cn from 'classnames'
import { Tweet as TweetEmbed } from 'react-twitter-widgets'
import { Column, HeaderGroup, useTable } from 'react-table'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'
import { Tweet, Tweets } from '@/models/tweet'
import { tweetKeys, useDeleteTweet, useTweets } from '@/hooks/useTweets'
import {
  ExternalLinkIcon,
  PencilIcon,
  RightArrowIcon,
  TrashIcon,
} from 'components/icons'
import Dialog from 'components/ui/Dialog'
import { DateTime } from 'luxon'

interface CustomHeaderGroup extends HeaderGroup<Tweet> {
  className?: string
}

function TweetsIndex(): JSX.Element {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isTweetDialogOpen, setIsTweetDialogOpen] = React.useState(false)
  const [selectedTweet, setSelectedTweet] = React.useState<string>('')
  const queryClient = useQueryClient()
  const {
    isLoading,
    error,
    data: tweets,
  } = useTweets({
    initialData: () =>
      queryClient.getQueryData<Tweets>(tweetKeys.lists()) ?? [],
    notifyOnChangeProps: 'tracked',
  })
  const deleteTweetMutation = useDeleteTweet({
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<Tweets>(tweetKeys.lists(), (prev) => {
        return prev.filter((tweet) => tweet.id !== deletedId)
      })
      queryClient.invalidateQueries({
        queryKey: tweetKeys.lists(),
        exact: true,
        refetchActive: false,
      })
      closeModal()
    },
  })

  const data = React.useMemo<Tweets>(() => tweets, [tweets])

  const columns = React.useMemo<Column<Tweet>[]>(
    () => [
      {
        Header: 'No',
        id: 'id',
        Cell: ({ cell }) => {
          return cell.row.index + 1
        },
        className: 'text-center',
      },
      {
        Header: 'Tweet ID',
        accessor: 'tweet_id',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) => {
          return (
            <div className="flex items-center">
              {value}
              <button onClick={() => selectTweet(value, 'view')}>
                <ExternalLinkIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          )
        },
      },
      {
        Header: 'Status',
        accessor: 'active',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) => {
          return value ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Inactive
            </span>
          )
        },
        className: 'text-center',
      },
      {
        Header: 'Category',
        accessor: 'categories',
        Cell: ({ value }) => value.name,
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => {
          const utc = DateTime.fromISO(value.toString(), {
            zone: 'UTC',
          })
          return utc.toLocal().toLocaleString(DateTime.DATETIME_FULL)
        },
      },
      {
        Header: 'Actions',
        accessor: 'id',
        id: 'actions',
        className: 'text-center',
        // eslint-disable-next-line react/display-name
        Cell: ({ value }) => {
          return (
            <div className="flex item-center justify-center">
              <Link href={`${router.asPath}/${value}/edit`}>
                <a>
                  <PencilIcon className="w-4 h-4 mr-2 transform hover:text-purple-500 hover:scale-110" />
                </a>
              </Link>
              <button onClick={() => selectTweet(value, 'delete')}>
                <TrashIcon className="w-4 h-4 mr-2 transform hover:text-red-500 hover:scale-110" />
              </button>
            </div>
          )
        },
      },
    ],
    [tweets]
  )

  function closeModal(): void {
    setIsDeleteDialogOpen(false)
  }

  function openModal(): void {
    setIsDeleteDialogOpen(true)
  }

  function closeTweetModal(): void {
    setIsTweetDialogOpen(false)
  }

  function openTweetModal(): void {
    setIsTweetDialogOpen(true)
  }

  function selectTweet(id: string, action: string) {
    setSelectedTweet(id)
    if (action === 'delete') {
      openModal()
    } else {
      openTweetModal()
    }
  }

  function _renderDeleteDialog(): JSX.Element {
    return (
      <Dialog
        title="Confirm to delete"
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        actions={
          <>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              onClick={() => deleteTweetMutation.mutate(selectedTweet)}
            >
              Delete
            </button>
            <button className="ml-2" onClick={closeModal}>
              Cancel
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete Tweet ID{' '}
          <code className="font-normal text-red-600 text-sm">
            {selectedTweet}
          </code>{' '}
          ? This action cannot be undone.
        </p>
      </Dialog>
    )
  }

  function _renderTweetDialog(): JSX.Element {
    return (
      <Dialog
        title="Tweet Widget"
        isOpen={isTweetDialogOpen}
        setIsOpen={setIsTweetDialogOpen}
        actions={
          <>
            <button onClick={closeTweetModal}>Close</button>
          </>
        }
      >
        <TweetEmbed tweetId={selectedTweet} />
      </Dialog>
    )
  }

  const tableInstance = useTable({ columns, data })
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  if (isLoading) return <h3>Loading...</h3>
  if (error) return <div>{error.message}</div>

  return (
    <div className="px-5 py-10">
      {_renderDeleteDialog()}
      {_renderTweetDialog()}

      <div className="lg:w-10/12 w-full mx-auto overflow-auto">
        <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
          Tweets
        </h2>
        <Link href={`${router.asPath}/new`}>
          <a className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0 hover:text-red-800">
            Create Tweet
            <RightArrowIcon className="w-4 h-4 ml-2" />
          </a>
        </Link>

        <div className="flex flex-col mt-10">
          <div className="sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table
                  className="min-w-full divide-y divide-gray-200"
                  {...getTableProps}
                >
                  <thead className="bg-gray-50">
                    {headerGroups.map((headerGroup, indexGroup) => (
                      <tr
                        className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
                        {...headerGroup.getHeaderGroupProps()}
                        key={indexGroup}
                      >
                        {headerGroup.headers.map(
                          (column: CustomHeaderGroup, indexColumn) => (
                            <th
                              scope="col"
                              {...column.getHeaderProps([
                                {
                                  className: cn(
                                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                    column.className
                                  ),
                                },
                              ])}
                              key={indexColumn}
                            >
                              {column.render('Header')}
                            </th>
                          )
                        )}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-gray-200 text-sm text-gray-600"
                    {...getTableBodyProps()}
                  >
                    {rows.map((row, indexRow) => {
                      prepareRow(row)
                      return (
                        <tr
                          className="hover:bg-gray-100"
                          {...row.getRowProps()}
                          key={indexRow}
                        >
                          {row.cells.map((cell, indexCell) => {
                            const column: typeof cell.column & {
                              className?: string
                            } = cell.column
                            return (
                              <td
                                {...cell.getCellProps([
                                  {
                                    className: cn(
                                      'px-6 py-4 whitespace-nowrap',
                                      column.className
                                    ),
                                  },
                                ])}
                                key={indexCell}
                              >
                                {cell.render('Cell')}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TweetsIndex
