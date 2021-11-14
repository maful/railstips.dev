import { FilterTweets, Tweet, Tweets, UpdateTweetForm } from '@/models/tweet'
import { supabase } from 'utils/supabaseClient'

const TABLE = 'tweets'

const getTweets = async (filter: FilterTweets = {}): Promise<Tweets> => {
  let request = supabase
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

  if (filter.categoryId && filter.categoryId !== 'all') {
    request = request.eq('category_id', filter.categoryId)
  }

  const { error, data } = await request

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

const updateTweet = async (form: UpdateTweetForm): Promise<Tweet> => {
  const { data, error } = await supabase
    .from<Tweet>(TABLE)
    .update({ ...form.tweet })
    .match({ id: form.id })

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
  updateTweet,
  deleteTweet
}
