import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const search = searchParams.get('search')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  let query = supabaseServer
    .from('time_entries')
    .select('*, project:projects(*), category:task_categories(*)')
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })
    .limit(100)

  if (from) query = query.gte('started_at', from)
  if (to) query = query.lte('started_at', to)

  if (search) {
    const { data: projects } = await supabaseServer
      .from('projects')
      .select('id')
      .ilike('name', `%${search}%`)
    const ids = (projects ?? []).map((p) => p.id)
    if (ids.length === 0) return NextResponse.json([])
    query = query.in('project_id', ids)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const startedAt = new Date(body.started_at)
  const endedAt = new Date(body.ended_at)
  const durationSeconds = Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000))
  const { data, error } = await supabaseServer
    .from('time_entries')
    .insert({
      project_id: body.project_id,
      category_id: body.category_id,
      sub_task: body.sub_task ?? null,
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      duration_seconds: durationSeconds,
    })
    .select('*, project:projects(*), category:task_categories(*)')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
