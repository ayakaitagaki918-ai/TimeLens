'use client'
import { TimeEntry } from '@/types'
import { formatElapsed } from '@/lib/utils'

interface Props {
  entry: TimeEntry
  elapsed: number
  onStop: () => void
  isLoading?: boolean
}

export default function ActiveTimer({ entry, elapsed, onStop, isLoading }: Props) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-sm font-medium opacity-90">記録中</span>
      </div>
      <p className="text-lg font-semibold truncate">{entry.project?.name}</p>
      <p className="text-sm opacity-80 mb-4">
        {entry.category?.icon} {entry.category?.name}
        {entry.sub_task && <span className="ml-2 opacity-70">/ {entry.sub_task}</span>}
      </p>
      <div className="text-4xl font-mono font-bold tracking-wider mb-5 text-center">
        {formatElapsed(elapsed)}
      </div>
      <button
        onClick={onStop}
        disabled={isLoading}
        className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl text-base
          active:scale-95 transition-transform disabled:opacity-60"
      >
        ■ ストップ
      </button>
    </div>
  )
}
