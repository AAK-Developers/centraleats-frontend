import axios from 'axios'
import type { DashboardApiResponse, DashboardStats } from './types'

export const API_BASE_URL = 'http://98.81.131.147:3001'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axios.get<DashboardApiResponse>(
    `${API_BASE_URL}/api/stats/dashboard`,
    { timeout: 10000 },
  )

  if (!data?.success) {
    throw new Error('El backend respondió sin success=true')
  }
  return data.data
}
