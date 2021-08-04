import type { NextApiRequest, NextApiResponse } from 'next'
import { Tweet } from 'lib/models/tweet'
import { supabase } from 'utils/supabaseClient'

interface Filter {
  category: string;
  startCursor?: number;
  endCursor?: number;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const query = req.query
    const category = query.category.toString()
    // const startCursor = query.start.toString() ?? '0'
    // const endCursor = query.end.toString() ?? '10'
    const { data, error } = await fetchTweets({
      category
    })

    if (error) {
      res.status(400).json({ message: error.message })
    } else {
      res.status(200).json({ tweets: data })
    }
  } else {
    res.status(400).json({ message: 'Invalid request method' })
  }
}

async function fetchTweets(filter: Filter) {
  let query = supabase
    .from<Tweet>('tweets')
    .select()
    .eq('active', true)
    .order('created_at', { ascending: false })
    // .range(filter.startCursor, filter.endCursor)

  if (filter.category !== 'all') {
    query = query.eq('category_id', filter.category)
  }

  const response = await query

  return response
}
