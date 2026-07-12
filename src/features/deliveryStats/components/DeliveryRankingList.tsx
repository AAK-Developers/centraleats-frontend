import { FaClock as Timer } from 'react-icons/fa'
import type { DeliveryRankingEntry } from '../types'
import { BlockHeader } from './shared'

function speedColor(minutes: number) {
  if (minutes <= 15) return { solid: '#1fb88f', tint: '#e3f7f1' }
  if (minutes <= 60) return { solid: '#f0ac2e', tint: '#fdf1de' }
  return { solid: '#ff8b5e', tint: '#ffeee5' }
}

interface Props {
  deliveryRanking: DeliveryRankingEntry[]
}

export default function DeliveryRankingList({ deliveryRanking }: Props) {
  const sorted = [...deliveryRanking].sort((a, b) => a.averageMinutes - b.averageMinutes)

  return (
    <section className="block">
      <BlockHeader title="Tiempo de entrega promedio" subtitle="Por restaurante, de más rápido a más lento" />
      <div className="row-list">
        {sorted.map((r) => {
          const c = speedColor(r.averageMinutes)
          return (
            <div className="row-item" key={r.vendorId}>
              <div
                className="product-thumb-fallback"
                style={{ background: c.tint, color: c.solid, width: 30, height: 30 }}
              >
                <Timer size={14} strokeWidth={2.3} />
              </div>
              <div className="name">{r.vendorName}</div>
              <div className="num" style={{ color: c.solid }}>{r.averageMinutes} min</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
