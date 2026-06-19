'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
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
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('projects').select('*').eq('is_active', true).order('created_at'),
      supabase.from('task_categories').select('*').order('sort_order'),
    ])
    setProjects(p ?? [])
    setCategories(c ?? [])
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
    const { data } = await supabase
      .from('projects')
      .insert({ name, color })
      .select()
      .single()
    if (data) setProjects((prev) => [...prev, data])
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
        <h1 className="text-2xl font-bold text-gray-800">TimeLens</h1>
        <span className="text-2xl">⏱</span>
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
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center text-blue-500 text-sm">
          プロジェクトを選んで作業を開始しよう
        </div>
      )}

      {!activeEntry && (
        <ProjectGrid
          projects={projects}
          onSelect={(p) => {
            if (!activeEntry) setSelectedProject(p)
          }}
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
