'use client'
import { useState } from 'react'
import { Project } from '@/types'

const COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EC4899', '#14B8A6', '#EF4444', '#6366F1',
  '#F97316', '#84CC16',
]

const ICONS = [
  '💼', '📊', '📋', '📝', '💡', '🎯', '🚀', '⚡',
  '💻', '📱', '🖥️', '🎨', '🎬', '📸', '🎵', '🎮',
  '🏥', '🦷', '💊', '🏃', '🧘', '🍎', '☕', '🌿',
  '🌟', '📚', '🎓', '💰', '📈', '🏢', '🏠', '❤️',
  '✈️', '🔧', '⚙️', '🔬',
]

interface Props {
  project: Project
  onSave: (id: string, name: string, color: string, icon: string | null) => Promise<void>
  onClose: () => void
}

export default function EditProjectModal({ project, onSave, onClose }: Props) {
  const [name, setName] = useState(project.name)
  const [color, setColor] = useState(project.color)
  const [icon, setIcon] = useState<string | null>(project.icon)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!name.trim()) return
    setIsSaving(true)
    await onSave(project.id, name.trim(), color, icon)
    setIsSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end z-50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 space-y-5 pb-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <i className="fa-solid fa-pen text-indigo-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-800">プロジェクトを編集</h3>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
            プロジェクト名
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
            アイコン
          </label>
          <div className="grid grid-cols-9 gap-1.5">
            <button
              onClick={() => setIcon(null)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                icon === null
                  ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110'
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
              style={icon === null ? { backgroundColor: color, color: 'white' } : {}}
            >
              {icon === null ? (name[0]?.toUpperCase() ?? 'A') : '−'}
            </button>
            {ICONS.map((em) => (
              <button
                key={em}
                onClick={() => setIcon(em)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90 ${
                  icon === em
                    ? 'ring-2 ring-offset-1 ring-indigo-500 bg-indigo-50 scale-110 shadow-md'
                    : 'hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
            カラー
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-9 h-9 rounded-xl transition-all active:scale-90 ${
                  color === c ? 'ring-2 ring-offset-2 ring-gray-600 scale-110 shadow-md' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/30"
        >
          {isSaving ? (
            <><i className="fa-solid fa-spinner fa-spin" /> 保存中…</>
          ) : (
            <><i className="fa-solid fa-check" /> 保存する</>
          )}
        </button>
      </div>
    </div>
  )
}
