import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from  "../../utils/supabaseClient"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
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
  let response: any
  if (category === "all") {
    response = await supabase.from("tweets")
      .select().eq("active", true).order("created_at", { ascending: false })
  } else {
    response = await supabase.from("tweets")
      .select().eq("category", Number(category)).eq("active", true).order("created_at", { ascending: false })
  }

  return response
}
