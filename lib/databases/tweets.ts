import { Tweet, Tweets } from '@/models/tweet'
import { supabase } from 'utils/supabaseClient'

const TABLE = 'tweets'

const getTweets = async (): Promise<Tweets> => {
  const { error, data } = await supabase
    .from<Tweet>(TABLE)
    .select(`
      id,
      tweet_id,
      active,
      created_at,
      category_id,
      categories ( name )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

const getTweet = async (id: string): Promise<Tweet> => {
  const { data, error } = await supabase
    .from<Tweet>(TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

const createTweet = async (tweet: Tweet): Promise<Tweet> => {
  const { data, error } = await supabase
    .from<Tweet>(TABLE)
    .insert(tweet)

  if (error) throw error

  return data[0]
}

const deleteTweet = async (id: string): Promise<Tweet> => {
  const { data, error } = await supabase
    .from<Tweet>(TABLE)
    .delete()
    .match({ id })

  if (error) throw error

  return data[0]
}

export {
  getTweets,
  getTweet,
  createTweet,
  deleteTweet
}
