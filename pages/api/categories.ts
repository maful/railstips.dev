import { Category } from 'lib/models/category'
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from 'utils/supabaseClient'

const allFirstCategory: Category = {
  id: '0',
  rank: 1,
  name: 'All',
  active: true
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const { data, error } = await fetchCategories()

    if (error) {
      res.status(400).json({ message: error.message })
    } else {
      const categories = [allFirstCategory, ...data]
      res.status(200).json({ categories })
    }
  } else {
    res.status(400).json({ message: 'Invalid request method' })
  }
}

async function fetchCategories() {
  const response = await supabase
    .from<Category>('categories')
    .select()
    .eq('active', true)
    .order('rank', { ascending: true })

  return response
}
