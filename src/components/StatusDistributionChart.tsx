import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { StatusDistributionEntry } from '../types'
import { BlockHeader } from './shared'

const COLORS: Record<string, string> = {
  COMPLETED: '#1fb88f',
  PENDING_PAYMENT: '#ff8b5e',
  READY: '#f0ac2e',
  PREPARING: '#4c9aff',
  PAID: '#7c6ff0',
  RECEIVED: '#a1a7b8',
}

const LABELS: Record<string, string> = {
  COMPLETED: 'Completado',
  PENDING_PAYMENT: 'Pago pendiente',
  READY: 'Listo',
  PREPARING: 'Preparando',
  PAID: 'Pagado',
  RECEIVED: 'Recibido',
}

interface Props {
  statusDistribution: StatusDistributionEntry[]
}

export default function StatusDistributionChart({ statusDistribution }: Props) {
  const data = statusDistribution.map((s) => ({
    name: LABELS[s.status] || s.status,
    value: s.total,
    key: s.status,
  }))

  return (
    <section className="block">
      <BlockHeader title="Estado de pedidos" />
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
            {data.map((d) => (
              <Cell key={d.key} fill={COLORS[d.key] || '#a1a7b8'} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#ffffff', border: '1px solid #eaecf4', borderRadius: 10, fontSize: 12 }}
            labelStyle={{ color: '#1c1f2e', fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#6b7180' }} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </section>
  )
}
