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
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/30">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-xs font-bold tracking-widest uppercase opacity-90">記録中</span>
      </div>
      <p className="text-xl font-bold truncate">{entry.project?.name}</p>
      <p className="text-sm opacity-75 mb-5 flex items-center gap-1.5">
        <span>{entry.category?.icon}</span>
        <span>{entry.category?.name}</span>
        {entry.sub_task && <span className="opacity-60">/ {entry.sub_task}</span>}
      </p>
      <div className="text-5xl font-mono font-bold tracking-wider mb-6 text-center drop-shadow-sm">
        {formatElapsed(elapsed)}
      </div>
      <button
        onClick={onStop}
        disabled={isLoading}
        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold py-3.5 rounded-2xl text-base active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <><i className="fa-solid fa-spinner fa-spin" /> 停止中…</>
        ) : (
          <><i className="fa-solid fa-stop" /> ストップ</>
        )}
      </button>
    </div>
  )
}
