import { PostgrestResponse } from '@supabase/postgrest-js/dist/main/lib/types'
import { Tweet } from 'models/tweet'
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from 'utils/supabaseClient'

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const query = req.query
    const { data, error } = await fetchTweets(query.category)

    if (error) {
      res.status(400).json({ message: error.message })
    } else {
      res.status(200).json({ tweets: data })
    }
  } else {
    res.status(400).json({ message: 'Invalid request method' })
  }
}

async function fetchTweets(category: string | string[]) {
  let response: PostgrestResponse<Tweet>
  if (category === 'all') {
    response = await supabase
      .from<Tweet>('tweets')
      .select()
      .eq('active', true)
      .order('created_at', { ascending: false })
  } else {
    const category_id = Array.isArray(category) ? category[0] : category
    response = await supabase
      .from<Tweet>('tweets')
      .select()
      .eq('category_id', category_id)
      .eq('active', true)
      .order('created_at', { ascending: false })
  }

  return response
}
