'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { TimeEntry } from '@/types'

export function useTimer() {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadActiveEntry = useCallback(async () => {
    const { data } = await supabase
      .from('time_entries')
      .select('*, project:projects(*), category:task_categories(*)')
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    setActiveEntry(data ?? null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadActiveEntry()
  }, [loadActiveEntry])

  useEffect(() => {
    if (!activeEntry) return
    const startMs = new Date(activeEntry.started_at).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - startMs) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeEntry])

  const startTimer = useCallback(async (
    projectId: string,
    categoryId: string,
    subTask?: string,
  ) => {
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        project_id: projectId,
        category_id: categoryId,
        sub_task: subTask ?? null,
        started_at: new Date().toISOString(),
      })
      .select('*, project:projects(*), category:task_categories(*)')
      .single()
    if (data) setActiveEntry(data)
    return { data, error }
  }, [])

  const stopTimer = useCallback(async () => {
    if (!activeEntry) return null
    const endedAt = new Date().toISOString()
    const durationSeconds = Math.floor(
      (new Date(endedAt).getTime() - new Date(activeEntry.started_at).getTime()) / 1000,
    )
    const { data, error } = await supabase
      .from('time_entries')
      .update({ ended_at: endedAt, duration_seconds: durationSeconds })
      .eq('id', activeEntry.id)
      .select()
      .single()
    setActiveEntry(null)
    setElapsed(0)
    return { data, error }
  }, [activeEntry])

  return { activeEntry, elapsed, isLoading, startTimer, stopTimer, loadActiveEntry }
}
