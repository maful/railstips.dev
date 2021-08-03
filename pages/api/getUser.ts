import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from 'utils/supabaseClient'

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let token = req.headers.token
  token = Array.isArray(token) ? token[0] : token

  const { data: user, error } = await supabase.auth.api.getUser(token)

  if (error) return res.status(401).json({ error: error.message })
  return res.status(200).json(user)
}

export default handler
