import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ChartPeriod } from '@/types'

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}時間${m > 0 ? `${m}分` : ''}`
  if (m > 0) return `${m}分${s > 0 ? `${s}秒` : ''}`
  return `${s}秒`
}

export function formatDurationHours(seconds: number): string {
  return (seconds / 3600).toFixed(1) + 'h'
}

export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), 'HH:mm')
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'M月d日(E)', { locale: ja })
}

export function formatElapsed(seconds: number): string {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function getPeriodRange(period: ChartPeriod, date: Date = new Date()) {
  switch (period) {
    case 'day':
      return { from: startOfDay(date), to: endOfDay(date) }
    case 'week':
      return { from: startOfWeek(date, { locale: ja }), to: endOfWeek(date, { locale: ja }) }
    case 'month':
      return { from: startOfMonth(date), to: endOfMonth(date) }
  }
}
