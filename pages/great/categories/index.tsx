import * as React from 'react'
import {
  categoryKeys,
  useCategories,
  useDeleteCategory,
} from '@/hooks/useCategories'
import { Categories, Category } from '@/models/category'
import { PencilIcon, RightArrowIcon, TrashIcon } from 'components/icons'
import Link from 'next/link'
import cn from 'classnames'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { Column, HeaderGroup, useTable } from 'react-table'
import { DateTime } from 'luxon'
import Dialog from 'components/ui/Dialog'

interface CustomHeaderGroup extends HeaderGroup<Category> {
  className?: string
}

function CategoriesIndex(): JSX.Element {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category>(null)
  const {
    isLoading,
    error,
    data: categories,
  } = useCategories({
    initialData: () => {
      return queryClient.getQueryData<Categories>(categoryKeys.lists()) ?? []
    },
    notifyOnChangeProps: 'tracked',
  })

  const data = React.useMemo<Categories>(() => categories, [categories])

  const columns = React.useMemo<Column<Category>[]>(
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
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Rank',
        accessor: 'rank',
        className: 'text-center',
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
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) => {
          const utc = DateTime.fromISO(value.toString())
          return utc.toLocal().toLocaleString(DateTime.DATETIME_FULL)
        },
      },
      {
        Header: 'Actions',
        id: 'actions',
        className: 'text-center',
        // eslint-disable-next-line react/display-name
        Cell: ({ row }) => {
          return (
            <div className="flex item-center justify-center">
              <Link href={`${router.asPath}/1/edit`}>
                <a>
                  <PencilIcon className="w-4 h-4 mr-2 transform hover:text-purple-500 hover:scale-110" />
                </a>
              </Link>
              <button onClick={() => selectCategory(row.original)}>
                <TrashIcon className="w-4 h-4 mr-2 transform hover:text-red-500 hover:scale-110" />
              </button>
            </div>
          )
        },
      },
    ],
    [categories]
  )

  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData<Categories>(categoryKeys.lists(), (prev) => {
        return prev.filter((category) => category.id !== deletedId)
      })
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
        exact: true,
        refetchActive: false,
      })
      closeModal()
    },
  })

  const tableInstance = useTable({ columns, data })
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  function closeModal(): void {
    setIsDeleteDialogOpen(false)
  }

  function openModal(): void {
    setIsDeleteDialogOpen(true)
  }

  function selectCategory(category: Category) {
    setSelectedCategory(category)
    openModal()
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
              onClick={() =>
                deleteCategoryMutation.mutate(selectedCategory?.id)
              }
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
          Are you sure you want to delete category{' '}
          <code className="font-normal text-red-600 text-sm">
            {selectedCategory?.name}
          </code>{' '}
          ? This action cannot be undone.
        </p>
      </Dialog>
    )
  }

  if (isLoading) return <h1>Loading Categories...</h1>
  if (error) return <h1>${error.message}</h1>

  return (
    <div className="px-5 py-10">
      {_renderDeleteDialog()}
      <div className="lg:w-10/12 w-full mx-auto overflow-auto">
        <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
          Categories
        </h2>
        <Link href={`${router.asPath}/new`}>
          <a className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0 hover:text-red-800">
            Create Category
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

export default CategoriesIndex
