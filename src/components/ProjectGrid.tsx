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
      <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">プロジェクト</h2>
      <div className="grid grid-cols-3 gap-3">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white shadow-md shadow-gray-200/60 border border-gray-50 active:scale-95 transition-all"
          >
            <span
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
              style={{ backgroundColor: p.color }}
            >
              {p.name[0]}
            </span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-2">
              {p.name}
            </span>
          </button>
        ))}
        <button
          onClick={onAdd}
          className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 border-dashed border-gray-200 active:scale-95 transition-all group hover:border-blue-300"
        >
          <span className="w-12 h-12 rounded-2xl bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-plus text-gray-300 group-hover:text-blue-400 text-lg transition-colors" />
          </span>
          <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-400 transition-colors">追加</span>
        </button>
      </div>
    </div>
  )
}
