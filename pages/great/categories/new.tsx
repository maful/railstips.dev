import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { LeftArrowIcon } from 'components/icons'
import Alert from 'components/ui/Alert'
import { categoryKeys, useCreateCategory } from '@/hooks/useCategories'

function CategoriesNew(): JSX.Element {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [name, setName] = React.useState('')
  const [rank, setRank] = React.useState('')
  const [active, setActive] = React.useState(true)

  const { mutate, isError, error, isSuccess } = useCreateCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
        exact: true,
      })
    },
  })

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault()
    mutate({ rank: Number(rank), name, active })
  }

  if (isSuccess) {
    router.push('/great/categories')
  }

  return (
    <div className="px-5 py-10">
      <div className="lg:w-10/12 w-full mx-auto overflow-auto">
        <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
          Create Category
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
              {isError && (
                <Alert>
                  <p className="mx-3">{error.message}</p>
                </Alert>
              )}

              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 block form-input w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Rank</span>
                <input
                  required
                  type="number"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="mt-2 block form-input w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
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
                      <span className="ml-2">Enable the category</span>
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

export default CategoriesNew
