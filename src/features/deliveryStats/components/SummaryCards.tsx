import { FaStore as Store, FaBox as Package, FaShoppingBag as ShoppingBag, FaWallet as Wallet, FaClock as Clock } from 'react-icons/fa'
import type { DashboardSummary } from '../types'
import { ACCENTS, money } from '../theme'
import { IconTile } from './shared'

interface Props {
  summary: DashboardSummary
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      icon: <Store size={17} strokeWidth={2.3} />,
      accent: ACCENTS[0],
      label: 'Restaurantes',
      value: summary.restaurants,
      caption: 'Con actividad',
    },
    {
      icon: <Package size={17} strokeWidth={2.3} />,
      accent: ACCENTS[3],
      label: 'Productos',
      value: summary.products,
      caption: 'En catálogo',
    },
    {
      icon: <ShoppingBag size={17} strokeWidth={2.3} />,
      accent: ACCENTS[2],
      label: 'Pedidos',
      value: summary.completedOrders,
      caption: 'Completados',
    },
    {
      icon: <Wallet size={17} strokeWidth={2.3} />,
      accent: ACCENTS[1],
      label: 'Ingresos',
      value: money(summary.totalRevenue),
      caption: `Ticket prom. ${money(summary.averageTicket)}`,
    },
  ]

  return (
    <>
      <div className="ticket-grid">
        {cards.map((c) => (
          <div className="ticket" key={c.label}>
            <IconTile accent={c.accent}>{c.icon}</IconTile>
            <div className="label">{c.label}</div>
            <div className="value">{c.value}</div>
            <div className="caption">{c.caption}</div>
          </div>
        ))}
      </div>

      <div className="mini-stat">
        <IconTile accent={ACCENTS[4]} size={30}>
          <Clock size={15} strokeWidth={2.3} />
        </IconTile>
        <div className="text">
          <div className="label">Tiempo de entrega promedio</div>
          <div className="value">{summary.averageDeliveryTime} min</div>
        </div>
      </div>
    </>
  )
}
