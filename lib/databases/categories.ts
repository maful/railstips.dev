import { Categories, Category, UpdateCategoryForm } from '@/models/category'
import { supabase } from 'utils/supabaseClient'

const TABLE = 'categories'

interface Filter {
  active?: boolean;
}

const getCategories = async (filter?: Filter): Promise<Categories> => {
  let request = supabase
    .from<Category>(TABLE)
    .select('*')
    .order('rank', { ascending: true })

  if (filter?.active) {
    request = request.eq('active', true)
  }

  const { data, error } = await request

  if (error) throw error

  return data
}

const getCategory = async (id: string): Promise<Category> => {
  const { data, error } = await supabase
    .from<Category>(TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

const createCategory = async (tweet: Category): Promise<Category> => {
  const { data, error } = await supabase
    .from<Category>(TABLE)
    .insert(tweet)

  if (error) throw error

  return data[0]
}

const updateCategory = async (form: UpdateCategoryForm): Promise<Category> => {
  const { data, error } = await supabase
    .from<Category>(TABLE)
    .update({ ...form.category })
    .match({ id: form.id })
    .single()

  if (error) throw error

  return data
}

const deleteCategory = async (id: string): Promise<Category> => {
  const { data, error } = await supabase
    .from<Category>(TABLE)
    .delete()
    .match({ id })

  if (error) throw error

  return data[0]
}

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}
