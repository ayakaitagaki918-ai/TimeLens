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
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-50 p-5 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 active:scale-95 transition-all"
        >
          <i className="fa-solid fa-arrow-left text-sm" />
        </button>
        <div>
          <p className="text-xs text-gray-400 font-medium">プロジェクト</p>
          <p className="font-bold text-gray-800">{project.name}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">作業の種類</p>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                selectedCategory?.id === cat.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <span className="text-2xl">{cat.icon ?? '📦'}</span>
              <span className={`text-xs text-center font-medium ${
                selectedCategory?.id === cat.id ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            細タスク <span className="text-gray-300 normal-case font-normal">（任意）</span>
          </p>
          <div className="relative">
            <i className="fa-solid fa-pencil absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text"
              value={subTask}
              onChange={(e) => setSubTask(e.target.value)}
              placeholder="例：FVセクション"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      <button
        onClick={() => selectedCategory && onStart(selectedCategory.id, subTask)}
        disabled={!selectedCategory || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-base active:scale-95 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-md shadow-blue-500/30"
      >
        {isLoading ? (
          <><i className="fa-solid fa-spinner fa-spin" /> 開始中…</>
        ) : (
          <><i className="fa-solid fa-play" /> スタート</>
        )}
      </button>
    </div>
  )
}
