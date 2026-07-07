import type { TopRestaurant } from '../types'
import { accentFor, money } from '../theme'
import { BlockHeader } from './shared'

interface Props {
  restaurants: TopRestaurant[]
}

export default function TopRestaurantsChart({ restaurants }: Props) {
  const top = [...restaurants].sort((a, b) => b.completedOrders - a.completedOrders).slice(0, 5)
  const max = Math.max(...top.map((r) => r.completedOrders), 1)

  return (
    <section className="block">
      <BlockHeader title="Top restaurantes" subtitle="Por pedidos completados" />
      {top.map((r, i) => {
        const accent = accentFor(i)
        return (
          <div className="rank-row" key={r.vendorId}>
            <div className="rank-top">
              <div className="rank-badge" style={{ background: accent.tint, color: accent.solid }}>
                {i + 1}
              </div>
              <div className="rank-info">
                <div className="rank-name">{r.vendorName}</div>
                <div className="rank-sub">{money(r.totalRevenue)} ingresos</div>
              </div>
              <div className="rank-metric" style={{ color: accent.solid }}>
                {r.completedOrders} pedidos
              </div>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(r.completedOrders / max) * 100}%`, background: accent.solid }}
              />
            </div>
          </div>
        )
      })}
    </section>
  )
}
