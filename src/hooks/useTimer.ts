'use client'
import { useState, useEffect, useCallback } from 'react'
import { TimeEntry } from '@/types'

export function useTimer() {
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const loadActiveEntry = useCallback(async () => {
    try {
      const res = await fetch('/api/timer')
      const data = await res.json()
      setActiveEntry(res.ok && data && data.id ? data : null)
    } catch {
      setActiveEntry(null)
    } finally {
      setIsLoading(false)
    }
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
    const res = await fetch('/api/timer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, categoryId, subTask }),
    })
    const data = await res.json()
    if (res.ok) setActiveEntry(data)
    return { data, error: res.ok ? null : data.error }
  }, [])

  const stopTimer = useCallback(async () => {
    if (!activeEntry) return null
    await fetch('/api/timer', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: activeEntry.id, startedAt: activeEntry.started_at }),
    })
    setActiveEntry(null)
    setElapsed(0)
    return { data: null, error: null }
  }, [activeEntry])

  return { activeEntry, elapsed, isLoading, startTimer, stopTimer, loadActiveEntry }
}
