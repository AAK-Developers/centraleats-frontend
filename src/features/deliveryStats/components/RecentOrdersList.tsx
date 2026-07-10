import type { RecentOrder } from '../types'
import { money } from '../theme'
import { BlockHeader } from './shared'

export default function RecentOrdersList({ recentOrders }: { recentOrders: RecentOrder[] }) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString('es-EC', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <section className="block">
      <BlockHeader title="Pedidos recientes" />
      <div className="row-list">
        {recentOrders.map((o) => (
          <div className="row-item" key={o.id}>
            <div className="name">
              {o.vendor}
              <span className="time">{fmt(o.createdAt)}</span>
            </div>
            <div className="num">{money(o.total)}</div>
            <span className={`status-pill ${o.status === 'COMPLETED' ? 'completed' : 'pending'}`}>
              {o.status === 'COMPLETED' ? 'Completado' : o.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
