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
      <div className="bg-white rounded-2xl p-5 shadow-md shadow-gray-200/60 border border-gray-50 text-center py-12">
        <i className="fa-solid fa-chart-pie text-4xl text-gray-200 mb-3 block" />
        <p className="text-gray-400 text-sm">{title}のデータがありません</p>
      </div>
    )
  }
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md shadow-gray-200/60 border border-gray-50">
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-gray-700">{title}</p>
        <span className="text-sm text-blue-600 font-mono font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
          {formatDurationHours(totalSeconds)}
        </span>
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
