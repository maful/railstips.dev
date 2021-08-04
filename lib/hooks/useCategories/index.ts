import {
  createCategory, deleteCategory, getCategories,
  getCategory, updateCategory
} from '@/databases/categories'
import { Categories, Category, UpdateCategoryForm } from '@/models/category'
import { PostgrestError } from '@/models/commons'
import {
  useMutation, UseMutationOptions, UseMutationResult,
  useQuery, UseQueryOptions, UseQueryResult
} from 'react-query'
import categoryKeys from './queries'

function useCategories<TData = Categories>(
  options?: UseQueryOptions<Categories, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(categoryKeys.lists(), () => getCategories(), options)
}

function useActiveCategories<TData = Categories>(
  options?: UseQueryOptions<Categories, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(categoryKeys.list('active'), () => getCategories({ active: true }), options)
}

function useCategory<TData = Category>(
  id: string,
  options?: UseQueryOptions<Category, Error, TData>
): UseQueryResult<TData, Error> {
  return useQuery(categoryKeys.detail(id), () => getCategory(id), options)
}

function useCreateCategory(
  options?: UseMutationOptions<Category, PostgrestError, Category>
): UseMutationResult<Category, PostgrestError, Category> {
  return useMutation(createCategory, options)
}

function useUpdateCategory(
  options?: UseMutationOptions<Category, PostgrestError, UpdateCategoryForm>
): UseMutationResult<Category, PostgrestError, UpdateCategoryForm> {
  return useMutation(updateCategory, options)
}

function useDeleteCategory(
  options?: UseMutationOptions<Category, PostgrestError, string>
): UseMutationResult<Category, PostgrestError, string> {
  return useMutation(deleteCategory, options)
}

export {
  categoryKeys,
  useCategories,
  useActiveCategories,
  useCategory,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory
}
