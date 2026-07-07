import axios from 'axios'
import type { DashboardApiResponse, DashboardStats } from './types'

// IMPORTANTE: esta IP es HTTP (no HTTPS). El permiso de tráfico
// cleartext para esta IP específica ya está configurado en
// android-config/network_security_config.xml — ver README.md.
export const API_BASE_URL = 'http://98.81.131.147:3001'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axios.get<DashboardApiResponse>(
    `${API_BASE_URL}/api/stats/dashboard`,
    { timeout: 10000 },
  )
  // El backend responde { success, data: {...} }
  if (!data?.success) {
    throw new Error('El backend respondió sin success=true')
  }
  return data.data
}
