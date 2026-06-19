'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, TaskCategory } from '@/types'
import AddProjectModal from '@/components/AddProjectModal'

export default function SettingsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editName, setEditName] = useState('')

  const loadData = useCallback(async () => {
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('projects').select('*').order('created_at'),
      supabase.from('task_categories').select('*').order('sort_order'),
    ])
    setProjects(p ?? [])
    setCategories(c ?? [])
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleAddProject(name: string, color: string) {
    const { data } = await supabase.from('projects').insert({ name, color }).select().single()
    if (data) setProjects((prev) => [...prev, data])
  }

  async function handleToggleProject(p: Project) {
    await supabase.from('projects').update({ is_active: !p.is_active }).eq('id', p.id)
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)))
  }

  async function handleRenameProject() {
    if (!editingProject || !editName.trim()) return
    await supabase.from('projects').update({ name: editName.trim() }).eq('id', editingProject.id)
    setProjects((prev) =>
      prev.map((x) => (x.id === editingProject.id ? { ...x, name: editName.trim() } : x)),
    )
    setEditingProject(null)
    setEditName('')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">設定</h1>

      {/* プロジェクト */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-700">プロジェクト</h2>
          <button
            onClick={() => setShowAddProject(true)}
            className="text-sm text-blue-600 font-semibold"
          >
            ＋ 追加
          </button>
        </div>
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <span
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: p.color }}
              >
                {p.name[0]}
              </span>
              {editingProject?.id === p.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameProject()}
                  autoFocus
                  className="flex-1 border border-blue-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                />
              ) : (
                <span className="flex-1 text-sm text-gray-700">{p.name}</span>
              )}
              <div className="flex gap-2">
                {editingProject?.id === p.id ? (
                  <>
                    <button onClick={handleRenameProject} className="text-blue-600 text-xs font-semibold">保存</button>
                    <button onClick={() => setEditingProject(null)} className="text-gray-400 text-xs">取消</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingProject(p); setEditName(p.name) }}
                      className="text-gray-400 text-xs"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleToggleProject(p)}
                      className={`text-xs font-semibold ${p.is_active ? 'text-green-500' : 'text-gray-300'}`}
                    >
                      {p.is_active ? '有効' : '無効'}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* カテゴリ */}
      <section>
        <h2 className="font-semibold text-gray-700 mb-3">作業カテゴリ</h2>
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3"
            >
              <span
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
                style={{ backgroundColor: c.color + '22' }}
              >
                {c.icon ?? '📦'}
              </span>
              <span className="flex-1 text-sm text-gray-700">{c.name}</span>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1">
          カテゴリはSupabaseで直接追加できます
        </p>
      </section>

      {showAddProject && (
        <AddProjectModal onSave={handleAddProject} onClose={() => setShowAddProject(false)} />
      )}
    </div>
  )
}
