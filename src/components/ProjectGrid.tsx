'use client'
import { Project } from '@/types'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CardProps {
  project: Project
  onSelect: (p: Project) => void
}

function ProjectCard({ project: p, onSelect }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <button
        onClick={() => onSelect(p)}
        {...listeners}
        className="w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white shadow-md shadow-gray-200/60 border border-gray-50 active:scale-95 transition-all touch-manipulation"
      >
        <span
          className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm"
          style={{ backgroundColor: p.icon ? p.color + '22' : p.color, color: p.icon ? 'inherit' : 'white' }}
        >
          {p.icon ?? p.name[0]}
        </span>
        <span className="text-xs font-semibold text-gray-700 text-center leading-tight line-clamp-2">
          {p.name}
        </span>
      </button>
    </div>
  )
}

interface Props {
  projects: Project[]
  onSelect: (project: Project) => void
  onAdd: () => void
  onReorder: (ids: string[]) => void
}

export default function ProjectGrid({ projects, onSelect, onAdd, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(projects, oldIndex, newIndex)
    onReorder(reordered.map((p) => p.id))
  }

  return (
    <div>
      <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">プロジェクト</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 gap-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={onSelect} />
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
        </SortableContext>
      </DndContext>
    </div>
  )
}
