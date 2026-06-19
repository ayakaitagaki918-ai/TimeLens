'use client'
import { useState, useEffect } from 'react'
import { TimeEntry } from '@/types'
import { useEntries } from '@/hooks/useEntries'
import { formatDate } from '@/lib/utils'
import EntryCard from '@/components/EntryCard'
import EditEntryModal from '@/components/EditEntryModal'

export default function HistoryPage() {
  const { entries, isLoading, fetchEntries, updateEntry, deleteEntry } = useEntries()
  const [search, setSearch] = useState('')
  const [editTarget, setEditTarget] = useState<TimeEntry | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  function handleSearch(value: string) {
    setSearch(value)
    fetchEntries(value || undefined)
  }

  // 日付でグルーピング
  const grouped = entries.reduce<Record<string, TimeEntry[]>>((acc, entry) => {
    const key = formatDate(entry.started_at)
    ;(acc[key] ??= []).push(entry)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-800">履歴</h1>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="プロジェクト名で検索"
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>記録がまだありません</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dayEntries]) => (
          <section key={date} className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 px-1">{date}</p>
            {dayEntries.map((e) => (
              <EntryCard key={e.id} entry={e} onEdit={setEditTarget} />
            ))}
          </section>
        ))
      )}

      {editTarget && (
        <EditEntryModal
          entry={editTarget}
          onSave={async (id, updates) => { await updateEntry(id, updates) }}
          onDelete={async (id) => { await deleteEntry(id) }}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  )
}
