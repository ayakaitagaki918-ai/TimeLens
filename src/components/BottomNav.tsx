'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'タイマー', icon: '⏱' },
  { href: '/history', label: '履歴', icon: '📋' },
  { href: '/stats', label: '統計', icon: '📊' },
  { href: '/settings', label: '設定', icon: '⚙️' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex max-w-md mx-auto">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
              active ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
