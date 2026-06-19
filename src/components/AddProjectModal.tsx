'use client'
import { useState } from 'react'

const COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EC4899', '#14B8A6', '#EF4444', '#6366F1',
  '#F97316', '#84CC16',
]

interface Props {
  onSave: (name: string, color: string) => Promise<void>
  onClose: () => void
}

export default function AddProjectModal({ onSave, onClose }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setIsSaving(true)
    await onSave(name.trim(), color)
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
        <h3 className="font-bold text-lg text-gray-800">プロジェクトを追加</h3>

        <div>
          <label className="text-xs text-gray-500 block mb-1">プロジェクト名</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="例：クリニックLP"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-2">カラー</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-full transition-transform active:scale-90 ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-600 scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || isSaving}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-transform disabled:opacity-40"
        >
          {isSaving ? '追加中…' : '追加する'}
        </button>
      </div>
    </div>
  )
}
