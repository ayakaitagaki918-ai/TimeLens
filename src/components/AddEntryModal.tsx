'use client'
import { useState } from 'react'
import { Project, TaskCategory } from '@/types'

interface Props {
  projects: Project[]
  categories: TaskCategory[]
  onSave: (body: {
    project_id: string
    category_id: string
    started_at: string
    ended_at: string
    sub_task?: string
  }) => Promise<void>
  onClose: () => void
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AddEntryModal({ projects, categories, onSave, onClose }: Props) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [date, setDate] = useState(todayStr())
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [subTask, setSubTask] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setError('')
    const startedAt = new Date(`${date}T${startTime}:00`)
    const endedAt = new Date(`${date}T${endTime}:00`)
    if (endedAt <= startedAt) {
      setError('終了時間は開始時間より後にしてください')
      return
    }
    setIsSaving(true)
    await onSave({
      project_id: projectId,
      category_id: categoryId,
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      sub_task: subTask.trim() || undefined,
    })
    setIsSaving(false)
    onClose()
  }

  const durationMin = (() => {
    const s = new Date(`${date}T${startTime}:00`)
    const e = new Date(`${date}T${endTime}:00`)
    const diff = Math.round((e.getTime() - s.getTime()) / 60000)
    if (diff <= 0) return null
    const h = Math.floor(diff / 60)
    const m = diff % 60
    return h > 0 ? `${h}時間${m > 0 ? m + '分' : ''}` : `${m}分`
  })()

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 space-y-5 pb-10 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
            <i className="fa-solid fa-clock-rotate-left text-green-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">時間を手動で追加</h3>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">開始時間</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">終了時間</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
          </div>
        </div>

        {durationMin && (
          <p className="text-center text-sm font-bold text-green-600 bg-green-50 rounded-xl py-2">
            <i className="fa-solid fa-hourglass-half mr-1.5" />{durationMin}
          </p>
        )}
        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">プロジェクト</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.icon ?? ''} {p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">作業の種類</label>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-semibold ${
                  categoryId === c.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                }`}
              >
                <span className="text-xl">{c.icon ?? '📦'}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            細タスク <span className="font-normal normal-case">（任意）</span>
          </label>
          <input
            value={subTask}
            onChange={(e) => setSubTask(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
            placeholder="例：FVセクション"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!projectId || !categoryId || isSaving}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-md shadow-green-500/30"
        >
          {isSaving ? (
            <><i className="fa-solid fa-spinner fa-spin" /> 追加中…</>
          ) : (
            <><i className="fa-solid fa-plus" /> 追加する</>
          )}
        </button>
      </div>
    </div>
  )
}
