import { createClient } from '@supabase/supabase-js'

// NEXT_PUBLIC_ プレフィックスなし → ブラウザに渡らないサーバー専用変数
const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_ANON_KEY ?? ''

export const supabaseServer = createClient(supabaseUrl, supabaseKey)
