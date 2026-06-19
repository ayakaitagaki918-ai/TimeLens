'use client'
import { TimeEntry } from '@/types'
import { formatDuration, formatTime } from '@/lib/utils'

interface Props {
  entry: TimeEntry
  onEdit: (entry: TimeEntry) => void
}

export default function EntryCard({ entry, onEdit }: Props) {
  const duration = entry.duration_seconds ?? 0
  return (
    <button
      onClick={() => onEdit(entry)}
      className="w-full text-left bg-white rounded-2xl px-4 py-3.5 shadow-md shadow-gray-200/60 border border-gray-50 active:scale-[0.98] transition-all flex items-center gap-3.5"
    >
      <span
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: entry.category?.color + '22' }}
      >
        {entry.category?.icon ?? '📦'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 truncate text-sm">{entry.project?.name}</p>
        <p className="text-xs text-gray-500 truncate">
          {entry.category?.name}
          {entry.sub_task && <span className="ml-1 text-gray-400">/ {entry.sub_task}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
          <i className="fa-regular fa-clock text-[10px]" />
          {entry.started_at && formatTime(entry.started_at)}
          {entry.ended_at && ` – ${formatTime(entry.ended_at)}`}
        </p>
      </div>
      <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
        <p className="font-mono font-bold text-blue-600 text-sm">{formatDuration(duration)}</p>
        <i className="fa-solid fa-pen-to-square text-gray-300 text-xs" />
      </div>
    </button>
  )
}
