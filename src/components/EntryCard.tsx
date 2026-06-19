'use client'
import { TimeEntry } from '@/types'
import { formatDuration, formatDate, formatTime } from '@/lib/utils'

interface Props {
  entry: TimeEntry
  onEdit: (entry: TimeEntry) => void
}

export default function EntryCard({ entry, onEdit }: Props) {
  const duration = entry.duration_seconds ?? 0
  return (
    <button
      onClick={() => onEdit(entry)}
      className="w-full text-left bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100
        active:scale-[0.98] transition-transform flex items-center gap-4"
    >
      <span
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: entry.category?.color + '22' }}
      >
        {entry.category?.icon ?? '📦'}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{entry.project?.name}</p>
        <p className="text-sm text-gray-500 truncate">
          {entry.category?.name}
          {entry.sub_task && <span className="ml-1 text-gray-400">/ {entry.sub_task}</span>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {entry.started_at && formatDate(entry.started_at)}&nbsp;
          {entry.started_at && formatTime(entry.started_at)}
          {entry.ended_at && ` – ${formatTime(entry.ended_at)}`}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-mono font-semibold text-blue-600">{formatDuration(duration)}</p>
      </div>
    </button>
  )
}
