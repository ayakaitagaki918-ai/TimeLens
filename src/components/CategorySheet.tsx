'use client'
import { useState } from 'react'
import { Project, TaskCategory } from '@/types'

interface Props {
  project: Project
  categories: TaskCategory[]
  onStart: (categoryId: string, subTask: string) => void
  onBack: () => void
  isLoading?: boolean
}

export default function CategorySheet({ project, categories, onStart, onBack, isLoading }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | null>(null)
  const [subTask, setSubTask] = useState('')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 text-xl">←</button>
        <div>
          <p className="text-xs text-gray-500">プロジェクト</p>
          <p className="font-semibold text-gray-800">{project.name}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-3">作業の種類を選択</p>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all active:scale-95 ${
                selectedCategory?.id === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              <span className="text-xl">{cat.icon ?? '📦'}</span>
              <span className="text-xs text-gray-700 text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div>
          <p className="text-sm text-gray-500 mb-2">細タスク（任意）</p>
          <input
            type="text"
            value={subTask}
            onChange={(e) => setSubTask(e.target.value)}
            placeholder="例：FVセクション"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      <button
        onClick={() => selectedCategory && onStart(selectedCategory.id, subTask)}
        disabled={!selectedCategory || isLoading}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-base
          active:scale-95 transition-transform disabled:opacity-40"
      >
        ▶ スタート
      </button>
    </div>
  )
}
