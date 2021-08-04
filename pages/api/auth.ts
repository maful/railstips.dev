import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from 'utils/supabaseClient'

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  supabase.auth.api.setAuthCookie(req, res)
}
