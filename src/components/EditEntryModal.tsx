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
    <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 space-y-4 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
        <div>
          <p className="font-bold text-lg text-gray-800">{entry.project?.name}</p>
          <p className="text-sm text-gray-500">
            {entry.category?.icon} {entry.category?.name}
            {durationSeconds > 0 && (
              <span className="ml-2 text-blue-600 font-semibold">{formatDuration(durationSeconds)}</span>
            )}
          </p>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">細タスク</label>
          <input
            value={subTask}
            onChange={(e) => setSubTask(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">開始</label>
            <input
              type="datetime-local"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">終了</label>
            <input
              type="datetime-local"
              value={endedAt}
              onChange={(e) => setEndedAt(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">メモ</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isSaving}
            className="flex-1 border border-red-200 text-red-500 py-3 rounded-xl font-semibold active:scale-95 transition-transform disabled:opacity-40"
          >
            削除
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-2 flex-grow bg-blue-600 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-40"
          >
            {isSaving ? '保存中…' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
