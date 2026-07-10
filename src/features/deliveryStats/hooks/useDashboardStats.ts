import { useQuery } from '@tanstack/react-query'
import { fetchDashboardStats } from '../api'

const REFRESH_INTERVAL_MS = 15_000

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  })
}
