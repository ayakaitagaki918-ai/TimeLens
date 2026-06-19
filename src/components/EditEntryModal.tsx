'use client'
import { useState } from 'react'
import { TimeEntry } from '@/types'
import { formatDuration } from '@/lib/utils'

interface Props {
  entry: TimeEntry
  onSave: (id: string, updates: Partial<TimeEntry>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}

function toLocalInput(dateStr: string) {
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function EditEntryModal({ entry, onSave, onDelete, onClose }: Props) {
  const [subTask, setSubTask] = useState(entry.sub_task ?? '')
  const [note, setNote] = useState(entry.note ?? '')
  const [startedAt, setStartedAt] = useState(toLocalInput(entry.started_at))
  const [endedAt, setEndedAt] = useState(entry.ended_at ? toLocalInput(entry.ended_at) : '')
  const [isSaving, setIsSaving] = useState(false)

  const durationSeconds = endedAt
    ? Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000)
    : 0

  async function handleSave() {
    setIsSaving(true)
    await onSave(entry.id, {
      sub_task: subTask || null,
      note: note || null,
      started_at: new Date(startedAt).toISOString(),
      ended_at: endedAt ? new Date(endedAt).toISOString() : null,
      duration_seconds: durationSeconds > 0 ? durationSeconds : null,
    })
    setIsSaving(false)
    onClose()
  }

  async function handleDelete() {
    if (!confirm('この記録を削除しますか？')) return
    setIsSaving(true)
    await onDelete(entry.id)
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 space-y-4 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

        <div className="flex items-start gap-3">
          <span
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: entry.category?.color + '22' }}
          >
            {entry.category?.icon ?? '📦'}
          </span>
          <div>
            <p className="font-bold text-gray-800">{entry.project?.name}</p>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              {entry.category?.name}
              {durationSeconds > 0 && (
                <span className="text-blue-600 font-semibold font-mono">{formatDuration(durationSeconds)}</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">細タスク</label>
          <input
            value={subTask}
            onChange={(e) => setSubTask(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              <i className="fa-solid fa-play text-green-400 mr-1" />開始
            </label>
            <input
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              <i className="fa-solid fa-stop text-red-400 mr-1" />終了
            </label>
            <input
              type="datetime-local"
              value={endedAt}
              onChange={(e) => setEndedAt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
            <i className="fa-solid fa-note-sticky text-yellow-400 mr-1" />メモ
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isSaving}
            className="flex-1 border-2 border-red-100 text-red-500 bg-red-50 py-3 rounded-xl font-semibold active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-trash text-sm" />削除
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/30"
          >
            {isSaving ? (
              <><i className="fa-solid fa-spinner fa-spin" /> 保存中…</>
            ) : (
              <><i className="fa-solid fa-check" /> 保存</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
