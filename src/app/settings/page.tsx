'use client'
import { useState, useEffect, useCallback } from 'react'
import { Project, TaskCategory } from '@/types'
import AddProjectModal from '@/components/AddProjectModal'
import EditProjectModal from '@/components/EditProjectModal'

export default function SettingsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [showCompleted, setShowCompleted] = useState(false)

  const loadData = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/categories'),
    ])
    const [p, c] = await Promise.all([pRes.json(), cRes.json()])
    setProjects(Array.isArray(p) ? p : [])
    setCategories(Array.isArray(c) ? c : [])
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleAddProject(name: string, color: string, icon: string | null) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, icon }),
    })
    const data = await res.json()
    if (res.ok) setProjects((prev) => [...prev, data])
  }

  async function handleEditProject(id: string, name: string, color: string, icon: string | null) {
    await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, icon }),
    })
    setProjects((prev) =>
      prev.map((x) => (x.id === id ? { ...x, name, color, icon } : x)),
    )
  }

  async function handleToggleProject(p: Project) {
    await fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    })
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)))
  }

  async function handleCompleteProject(p: Project) {
    await fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: true }),
    })
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_completed: true } : x)))
  }

  async function handleRestoreProject(p: Project) {
    await fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed: false }),
    })
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_completed: false } : x)))
  }

  async function handleDeleteProject(p: Project) {
    if (!confirm(`「${p.name}」を削除しますか？\n関連する時間記録もすべて削除されます。`)) return
    await fetch(`/api/projects/${p.id}`, { method: 'DELETE' })
    setProjects((prev) => prev.filter((x) => x.id !== p.id))
  }

  const activeProjects = projects.filter((p) => !p.is_completed)
  const completedProjects = projects.filter((p) => p.is_completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <div className="w-10 h-10 rounded-2xl bg-slate-600 flex items-center justify-center shadow-md shadow-slate-500/40">
          <i className="fa-solid fa-gear text-white" />
        </div>
      </div>

      {/* 進行中プロジェクト */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-folder text-gray-300" />
            プロジェクト
          </h2>
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-1.5 text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-plus text-xs" />追加
          </button>
        </div>
        <div className="space-y-2">
          {activeProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl px-4 py-3 shadow-md shadow-gray-200/60 border border-gray-50 flex items-center gap-3"
            >
              <span
                className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm"
                style={{ backgroundColor: p.icon ? p.color + '22' : p.color, color: p.icon ? 'inherit' : 'white' }}
              >
                {p.icon ?? p.name[0]}
              </span>
              <span className={`flex-1 text-sm font-semibold ${p.is_active ? 'text-gray-700' : 'text-gray-400'}`}>
                {p.name}
              </span>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setEditingProject(p)}
                  className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                  title="編集"
                >
                  <i className="fa-solid fa-pen text-xs" />
                </button>
                <button
                  onClick={() => handleCompleteProject(p)}
                  className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 hover:bg-amber-100 transition-colors"
                  title="完了にする"
                >
                  <i className="fa-solid fa-flag-checkered text-xs" />
                </button>
                <button
                  onClick={() => handleDeleteProject(p)}
                  className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                  title="削除"
                >
                  <i className="fa-solid fa-trash text-xs" />
                </button>
                <button
                  onClick={() => handleToggleProject(p)}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${p.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-300'}`}
                >
                  {p.is_active
                    ? <><i className="fa-solid fa-circle-check mr-1" />有効</>
                    : <><i className="fa-solid fa-circle-xmark mr-1" />無効</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 完了済みプロジェクト */}
      {completedProjects.length > 0 && (
        <section>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="flex items-center justify-between w-full mb-3"
          >
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <i className="fa-solid fa-flag-checkered text-gray-300" />
              完了済み（{completedProjects.length}）
            </h2>
            <i className={`fa-solid fa-chevron-${showCompleted ? 'up' : 'down'} text-gray-300 text-xs`} />
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completedProjects.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex items-center gap-3"
                >
                  <span
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm opacity-50"
                    style={{ backgroundColor: p.icon ? p.color + '22' : p.color, color: p.icon ? 'inherit' : 'white' }}
                  >
                    {p.icon ?? p.name[0]}
                  </span>
                  <span className="flex-1 text-sm font-semibold text-gray-400 line-through">
                    {p.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreProject(p)}
                      className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <i className="fa-solid fa-rotate-left mr-1" />復元
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                    >
                      <i className="fa-solid fa-trash text-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 作業カテゴリ */}
      <section>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <i className="fa-solid fa-tags text-gray-300" />
          作業カテゴリ
        </h2>
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl px-4 py-3 shadow-md shadow-gray-200/60 border border-gray-50 flex items-center gap-3"
            >
              <span
                className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
                style={{ backgroundColor: c.color + '22' }}
              >
                {c.icon ?? '📦'}
              </span>
              <span className="flex-1 text-sm font-semibold text-gray-700">{c.name}</span>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 px-1 flex items-center gap-1.5">
          <i className="fa-solid fa-circle-info text-[10px]" />
          カテゴリはSupabaseで直接追加できます
        </p>
      </section>

      {showAddProject && (
        <AddProjectModal onSave={handleAddProject} onClose={() => setShowAddProject(false)} />
      )}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onSave={handleEditProject}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  )
}
