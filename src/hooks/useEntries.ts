'use client'
import { useState, useCallback } from 'react'
import { TimeEntry } from '@/types'

export function useEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchEntries = useCallback(async (search?: string) => {
    setIsLoading(true)
    const url = search ? `/api/entries?search=${encodeURIComponent(search)}` : '/api/entries'
    const res = await fetch(url)
    const data = await res.json()
    setEntries(Array.isArray(data) ? data : [])
    setIsLoading(false)
  }, [])

  const updateEntry = useCallback(async (
    id: string,
    updates: Partial<Pick<TimeEntry, 'sub_task' | 'started_at' | 'ended_at' | 'duration_seconds' | 'note'>>,
  ) => {
    const res = await fetch(`/api/entries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    const data = await res.json()
    if (res.ok) setEntries((prev) => prev.map((e) => (e.id === id ? data : e)))
    return { data: res.ok ? data : null, error: res.ok ? null : data.error }
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    const res = await fetch(`/api/entries/${id}`, { method: 'DELETE' })
    if (res.ok) setEntries((prev) => prev.filter((e) => e.id !== id))
    return { error: res.ok ? null : 'error' }
  }, [])

  const addEntry = useCallback(async (body: {
    project_id: string
    category_id: string
    started_at: string
    ended_at: string
    sub_task?: string
  }) => {
    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.ok) setEntries((prev) => [data, ...prev])
    return { data: res.ok ? data : null, error: res.ok ? null : data.error }
  }, [])

  return { entries, isLoading, fetchEntries, updateEntry, deleteEntry, addEntry }
}
