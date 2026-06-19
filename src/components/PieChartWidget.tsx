'use client'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartData } from '@/types'
import { formatDurationHours } from '@/lib/utils'

interface Props {
  data: ChartData[]
  title: string
  totalSeconds: number
}

export default function PieChartWidget({ data, title, totalSeconds }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center py-10">
        <p className="text-gray-300 text-3xl mb-2">📊</p>
        <p className="text-gray-400 text-sm">{title}のデータがありません</p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <p className="font-semibold text-gray-700">{title}</p>
        <p className="text-sm text-blue-600 font-mono font-semibold">
          合計 {formatDurationHours(totalSeconds)}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: number) => [formatDurationHours(val), '時間']}
          />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
