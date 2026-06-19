import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

// アクティブなタイマーを取得
export async function GET() {
  const { data, error } = await supabaseServer
    .from('time_entries')
    .select('*, project:projects(*), category:task_categories(*)')
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// タイマー開始
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await supabaseServer
    .from('time_entries')
    .insert({
      project_id: body.projectId,
      category_id: body.categoryId,
      sub_task: body.subTask ?? null,
      started_at: new Date().toISOString(),
    })
    .select('*, project:projects(*), category:task_categories(*)')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// タイマー停止
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const endedAt = new Date().toISOString()
  const durationSeconds = Math.floor(
    (new Date(endedAt).getTime() - new Date(body.startedAt).getTime()) / 1000,
  )
  const { error } = await supabaseServer
    .from('time_entries')
    .update({ ended_at: endedAt, duration_seconds: durationSeconds })
    .eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
