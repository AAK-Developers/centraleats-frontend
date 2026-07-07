import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats } from '../api'

// Intervalo de actualización automática. Súbelo/bájalo según qué tan
// seguido cambian los datos y cuánto tráfico quieras generar.
const REFRESH_INTERVAL_MS = 15_000

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false, // pausa si el usuario minimiza la app
    retry: 2,
  })
}
