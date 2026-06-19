'use client'
import { Project } from '@/types'

interface Props {
  projects: Project[]
  onSelect: (project: Project) => void
  onAdd: () => void
}

export default function ProjectGrid({ projects, onSelect, onAdd }: Props) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-500 mb-3">プロジェクトを選択</h2>
      <div className="grid grid-cols-3 gap-3">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-sm
              border border-gray-100 active:scale-95 transition-transform"
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: p.color }}
            >
              {p.name[0]}
            </span>
            <span className="text-xs text-gray-700 text-center leading-tight line-clamp-2">
              {p.name}
            </span>
          </button>
        ))}
        <button
          onClick={onAdd}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed
            border-gray-200 active:scale-95 transition-transform"
        >
          <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-400">
            +
          </span>
          <span className="text-xs text-gray-400 text-center">追加</span>
        </button>
      </div>
    </div>
  )
}
