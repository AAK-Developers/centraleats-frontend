import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { OrdersByHour } from '../types'
import { BlockHeader } from './shared'

interface Props {
  ordersByHour: OrdersByHour[]
}

export default function OrdersByHourChart({ ordersByHour }: Props) {
  const data = ordersByHour.map((h) => ({ hour: `${h.hour}h`, orders: h.orders }))

  return (
    <section className="block">
      <BlockHeader title="Pedidos por hora" subtitle="Distribución de pedidos en el día" />
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 4 }}>
          <CartesianGrid vertical={false} stroke="#eaecf4" />
          <XAxis
            dataKey="hour"
            interval={3}
            tick={{ fill: '#a1a7b8', fontSize: 10 }}
            axisLine={{ stroke: '#eaecf4' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#ffffff', border: '1px solid #eaecf4', borderRadius: 10, fontSize: 12 }}
            labelStyle={{ color: '#1c1f2e', fontWeight: 600 }}
          />
          <defs>
            <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c6ff0" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c6ff0" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#7c6ff0"
            strokeWidth={2.5}
            fill="url(#ordersFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  )
}
