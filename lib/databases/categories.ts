import { Categories, Category } from '@/models/category'
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

const createCatgeory = async (tweet: Category): Promise<Category> => {
  const { data, error } = await supabase
    .from<Category>(TABLE)
    .insert(tweet)

  if (error) throw error

  return data[0]
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
  createCatgeory,
  deleteCategory
}
