import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'

import { LeftArrowIcon } from 'components/icons'
import { categoryKeys, useCreateCategory } from '@/hooks/useCategories'
import { CategoryForm } from '@/features/Categories'
import { Category } from '@/models/category'

function CategoriesNew(): JSX.Element {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate, error, isSuccess } = useCreateCategory({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
        exact: true,
      })
    },
  })

  async function handleSubmit({ rank, name, active }: Category): Promise<void> {
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
          <CategoryForm error={error?.message} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default CategoriesNew
