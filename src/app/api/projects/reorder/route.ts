import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { ids } = await req.json() as { ids: string[] }
  const updates = ids.map((id, index) =>
    supabaseServer.from('projects').update({ sort_order: index }).eq('id', id),
  )
  await Promise.all(updates)
  return NextResponse.json({ ok: true })
}
