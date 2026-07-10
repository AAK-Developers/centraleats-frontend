import { useEffect } from 'react'
import { useDashboardStats } from './hooks/useDashboardStats'
import { ACCENTS } from './theme'
import logoUrl from '../../assets/CentralEatsLogo.png'
import { GroupLabel } from './components/shared'
import SummaryCards from './components/SummaryCards'
import TopRestaurantsChart from './components/TopRestaurantsChart'
import TopProductsChart from './components/TopProductsChart'
import OrdersByHourChart from './components/OrdersByHourChart'
import StatusDistributionChart from './components/StatusDistributionChart'
import DeliveryRankingList from './components/DeliveryRankingList'
import RecentOrdersList from './components/RecentOrdersList'
import { WaveBottom, WaveTop } from './components/Waves'
import './deliveryStats.css'

export default function DeliveryStatsApp() {
  const { data: stats, error, isLoading, isFetching } = useDashboardStats()

  // Inyectar clase al body solo cuando se renderiza este app
  useEffect(() => {
    document.body.classList.add('is-native')
    return () => {
      document.body.classList.remove('is-native')
    }
  }, [])

  return (
    <>
      <WaveTop />

      <div className="app">
        <div className="app-header">
          <div className="header-content">
            <div className="brand">
              <img src={logoUrl} alt="CentralEats" className="brand-logo" />
              <span style={{ color: '#042E63' }}>Central</span>
              <span style={{ color: '#E65100' }}>Eats</span>
            </div>
            <h1>Panel de Pedidos</h1>
            {stats && (
              <div className="updated">
                <span className={`live-dot ${isFetching ? 'pulsing' : ''}`} />
                Actualizado {new Date(stats.generatedAt).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </div>

        {isLoading && <p className="state-msg">Cargando estadÃ­sticasâ€¦</p>}

        {error && (
          <p className="state-msg error">
            {error instanceof Error ? error.message : 'No se pudo conectar con el servidor'}. Verifica que el
            backend estÃ© encendido.
          </p>
        )}

        {stats && (
          <>
            <GroupLabel accent={ACCENTS[0]}>Resumen general</GroupLabel>
            <SummaryCards summary={stats.summary} />

            <GroupLabel accent={ACCENTS[3]}>Actividad</GroupLabel>
            <OrdersByHourChart ordersByHour={stats.ordersByHour} />
            <StatusDistributionChart statusDistribution={stats.statusDistribution} />

            <GroupLabel accent={ACCENTS[1]}>Rankings</GroupLabel>
            <TopRestaurantsChart restaurants={stats.topRestaurants} />
            <TopProductsChart products={stats.topProducts} />
            <DeliveryRankingList deliveryRanking={stats.deliveryRanking} />

            <GroupLabel accent={ACCENTS[2]}>Recientes</GroupLabel>
            <RecentOrdersList recentOrders={stats.recentOrders} />
          </>
        )}
      </div>

      <WaveBottom />
    </>
  )
}
