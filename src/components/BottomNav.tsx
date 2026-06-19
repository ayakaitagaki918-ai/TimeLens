'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: 'タイマー', icon: 'fa-solid fa-clock' },
  { href: '/history', label: '履歴', icon: 'fa-solid fa-list' },
  { href: '/stats', label: '統計', icon: 'fa-solid fa-chart-pie' },
  { href: '/settings', label: '設定', icon: 'fa-solid fa-gear' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex max-w-md mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors ${
              active ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <i className={`${icon} text-lg`} />
            <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
