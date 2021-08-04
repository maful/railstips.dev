import * as React from 'react'

import { Category } from '@/models/category'
import Alert from 'components/ui/Alert'

interface CategoryFormProps {
  error?: string
  handleSubmit(category: Category): Promise<void>
  category?: Category | null
}

function CategoryForm(props: CategoryFormProps): JSX.Element {
  const { category, error, handleSubmit } = props
  const [name, setName] = React.useState(category?.name ?? '')
  const [rank, setRank] = React.useState(category?.rank ?? '')
  const [active, setActive] = React.useState(category?.active ?? true)

  async function handleSave(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault()
    handleSubmit({ name, rank: Number(rank), active })
  }

  return (
    <form className="px-4 py-4" onSubmit={handleSave}>
      <div className="grid grid-cols-1 gap-6">
        {error && (
          <Alert>
            <p className="mx-3">{error}</p>
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
  )
}

export default CategoryForm
