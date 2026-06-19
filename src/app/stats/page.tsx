'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ChartData, ChartPeriod, TimeEntry } from '@/types'
import { getPeriodRange } from '@/lib/utils'
import PieChartWidget from '@/components/PieChartWidget'

const PERIOD_LABELS: Record<ChartPeriod, string> = {
  day: '今日',
  week: '今週',
  month: '今月',
}

function buildCategoryChart(entries: TimeEntry[]): { data: ChartData[]; total: number } {
  const map = new Map<string, { seconds: number; color: string }>()
  let total = 0
  for (const e of entries) {
    const key = e.category?.name ?? '不明'
    const color = e.category?.color ?? '#6B7280'
    const s = e.duration_seconds ?? 0
    total += s
    const prev = map.get(key)
    map.set(key, { seconds: (prev?.seconds ?? 0) + s, color })
  }
  const data = Array.from(map.entries())
    .map(([name, { seconds, color }]) => ({ name, value: seconds, color }))
    .sort((a, b) => b.value - a.value)
  return { data, total }
}

function buildProjectChart(entries: TimeEntry[]): { data: ChartData[]; total: number } {
  const map = new Map<string, { seconds: number; color: string }>()
  let total = 0
  for (const e of entries) {
    const key = e.project?.name ?? '不明'
    const color = e.project?.color ?? '#6B7280'
    const s = e.duration_seconds ?? 0
    total += s
    const prev = map.get(key)
    map.set(key, { seconds: (prev?.seconds ?? 0) + s, color })
  }
  const data = Array.from(map.entries())
    .map(([name, { seconds, color }]) => ({ name, value: seconds, color }))
    .sort((a, b) => b.value - a.value)
  return { data, total }
}

export default function StatsPage() {
  const [period, setPeriod] = useState<ChartPeriod>('week')
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchStats = useCallback(async (p: ChartPeriod) => {
    setIsLoading(true)
    const { from, to } = getPeriodRange(p)
    const { data } = await supabase
      .from('time_entries')
      .select('*, project:projects(*), category:task_categories(*)')
      .not('ended_at', 'is', null)
      .gte('started_at', from.toISOString())
      .lte('started_at', to.toISOString())
    setEntries(data ?? [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchStats(period)
  }, [period, fetchStats])

  const categoryChart = buildCategoryChart(entries)
  const projectChart = buildProjectChart(entries)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">統計</h1>

      <div className="bg-white rounded-2xl p-1 flex shadow-sm border border-gray-100">
        {(Object.keys(PERIOD_LABELS) as ChartPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              period === p ? 'bg-blue-600 text-white' : 'text-gray-500'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <PieChartWidget
            title="作業種類別"
            data={categoryChart.data}
            totalSeconds={categoryChart.total}
          />
          <PieChartWidget
            title="プロジェクト別"
            data={projectChart.data}
            totalSeconds={projectChart.total}
          />
        </div>
      )}
    </div>
  )
}
