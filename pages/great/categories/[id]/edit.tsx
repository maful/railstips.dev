import * as React from 'react'
import { useQueryClient } from 'react-query'
import { useRouter } from 'next/router'

import { LeftArrowIcon } from 'components/icons'
import {
  categoryKeys,
  useCategory,
  useUpdateCategory,
} from '@/hooks/useCategories'
import { CategoryForm } from '@/features/Categories'
import { Category } from '@/models/category'

function CategoriesEdit(): JSX.Element {
  const queryClient = useQueryClient()
  const router = useRouter()
  const id = router.query.id.toString()

  const { data, isLoading } = useCategory(id, { refetchOnWindowFocus: false })

  const { mutate, error, isSuccess } = useUpdateCategory({
    onSuccess: (updatedCategory, form) => {
      queryClient.setQueryData(categoryKeys.detail(form.id), updatedCategory)
      queryClient.invalidateQueries(categoryKeys.lists())
    },
  })

  async function handleSubmit(category: Category): Promise<void> {
    mutate({ id, category: { ...category } })
  }

  if (isSuccess) {
    router.push('/great/categories')
  }

  return (
    <div className="px-5 py-10">
      <div className="lg:w-10/12 w-full mx-auto overflow-auto">
        <h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
          Edit Category
        </h2>
        <button onClick={() => router.back()}>
          <div className="text-red-500 inline-flex items-center md:mb-2 lg:mb-0 hover:text-red-800">
            <LeftArrowIcon className="w-4 h-4 mr-2" />
            Back
          </div>
        </button>
        <div className="mt-8 max-w-md">
          {isLoading ? (
            <>Loading...</>
          ) : (
            <CategoryForm
              error={error?.message}
              handleSubmit={handleSubmit}
              category={data}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoriesEdit
