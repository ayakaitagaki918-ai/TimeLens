export interface Project {
  id: string
  name: string
  color: string
  icon: string | null
  is_active: boolean
  is_completed: boolean
  sort_order: number
  created_at: string
}

export interface TaskCategory {
  id: string
  name: string
  icon: string | null
  color: string
  sort_order: number
  created_at: string
}

export interface TimeEntry {
  id: string
  project_id: string
  category_id: string
  sub_task: string | null
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  note: string | null
  created_at: string
  project?: Project
  category?: TaskCategory
}

export type ChartPeriod = 'day' | 'week' | 'month'

export interface ChartData {
  name: string
  value: number
  color: string
}
