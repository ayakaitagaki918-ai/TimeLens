'use client'
import { useState, useEffect, useCallback } from 'react'
import { Project, TaskCategory } from '@/types'
import { useTimer } from '@/hooks/useTimer'
import ActiveTimer from '@/components/ActiveTimer'
import ProjectGrid from '@/components/ProjectGrid'
import CategorySheet from '@/components/CategorySheet'
import AddProjectModal from '@/components/AddProjectModal'

export default function HomePage() {
  const { activeEntry, elapsed, isLoading: timerLoading, startTimer, stopTimer } = useTimer()
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAddProject, setShowAddProject] = useState(false)
  const [isStopping, setIsStopping] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  const loadData = useCallback(async () => {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/categories'),
    ])
    const [p, c] = await Promise.all([pRes.json(), cRes.json()])
    setProjects((Array.isArray(p) ? p : []).filter((x: Project) => x.is_active))
    setCategories(Array.isArray(c) ? c : [])
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleStop() {
    setIsStopping(true)
    await stopTimer()
    setIsStopping(false)
  }

  async function handleStart(categoryId: string, subTask: string) {
    if (!selectedProject) return
    setIsStarting(true)
    await startTimer(selectedProject.id, categoryId, subTask)
    setSelectedProject(null)
    setIsStarting(false)
  }

  async function handleAddProject(name: string, color: string) {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    })
    const data = await res.json()
    if (res.ok) setProjects((prev) => [...prev, data])
  }

  if (timerLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TimeLens</h1>
          <p className="text-xs text-gray-400 mt-0.5">時間を記録して傾向を掴もう</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/40">
          <i className="fa-solid fa-clock text-white" />
        </div>
      </div>

      {activeEntry ? (
        <ActiveTimer
          entry={activeEntry}
          elapsed={elapsed}
          onStop={handleStop}
          isLoading={isStopping}
        />
      ) : selectedProject ? (
        <CategorySheet
          project={selectedProject}
          categories={categories}
          onStart={handleStart}
          onBack={() => setSelectedProject(null)}
          isLoading={isStarting}
        />
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3 text-blue-500">
          <i className="fa-solid fa-hand-pointer text-blue-400 text-lg" />
          <p className="text-sm font-medium">プロジェクトを選んで作業を開始しよう</p>
        </div>
      )}

      {!activeEntry && (
        <ProjectGrid
          projects={projects}
          onSelect={(p) => { if (!activeEntry) setSelectedProject(p) }}
          onAdd={() => setShowAddProject(true)}
        />
      )}

      {showAddProject && (
        <AddProjectModal
          onSave={handleAddProject}
          onClose={() => setShowAddProject(false)}
        />
      )}
    </div>
  )
}
