import { FaUtensils as UtensilsCrossed } from 'react-icons/fa'
import type { TopProduct } from '../types'
import { accentFor } from '../theme'
import { BlockHeader } from './shared'

interface Props {
  products: TopProduct[]
}

export default function TopProductsChart({ products }: Props) {
  const top = [...products].sort((a, b) => b.totalSold - a.totalSold).slice(0, 5)

  return (
    <section className="block">
      <BlockHeader title="Platos más vendidos" subtitle="Top productos por unidades vendidas" />
      <div className="row-list">
        {top.map((p, i) => {
          const accent = accentFor(i)
          return (
            <div className="row-item" key={p.productId}>
              {p.imageUrl ? (
                <img className="product-thumb" src={p.imageUrl} alt={p.productName} loading="lazy" />
              ) : (
                <div
                  className="product-thumb-fallback"
                  style={{ background: accent.tint, color: accent.solid }}
                >
                  <UtensilsCrossed size={16} strokeWidth={2.2} />
                </div>
              )}
              <div className="name">
                {p.productName}
                <span className="time">{p.vendorName}</span>
              </div>
              <div className="num" style={{ color: accent.solid }}>{p.totalSold}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
