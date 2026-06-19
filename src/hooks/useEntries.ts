'use client'
import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { TimeEntry } from '@/types'

export function useEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchEntries = useCallback(async (projectName?: string) => {
    setIsLoading(true)
    let query = supabase
      .from('time_entries')
      .select('*, project:projects(*), category:task_categories(*)')
      .not('ended_at', 'is', null)
      .order('started_at', { ascending: false })
      .limit(100)

    if (projectName) {
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .ilike('name', `%${projectName}%`)
      const ids = (projects ?? []).map((p) => p.id)
      if (ids.length === 0) {
        setEntries([])
        setIsLoading(false)
        return
      }
      query = query.in('project_id', ids)
    }

    const { data } = await query
    setEntries(data ?? [])
    setIsLoading(false)
  }, [])

  const updateEntry = useCallback(async (
    id: string,
    updates: Partial<Pick<TimeEntry, 'sub_task' | 'started_at' | 'ended_at' | 'duration_seconds' | 'note'>>,
  ) => {
    const { data, error } = await supabase
      .from('time_entries')
      .update(updates)
      .eq('id', id)
      .select('*, project:projects(*), category:task_categories(*)')
      .single()
    if (data) {
      setEntries((prev) => prev.map((e) => (e.id === id ? data : e)))
    }
    return { data, error }
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    const { error } = await supabase.from('time_entries').delete().eq('id', id)
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
    return { error }
  }, [])

  return { entries, isLoading, fetchEntries, updateEntry, deleteEntry }
}
