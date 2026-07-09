import axios from 'axios'
import type { DashboardApiResponse, DashboardStats } from './types'

export const API_BASE_URL = 'http://98.81.131.147:3001'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axios.get<DashboardApiResponse>(
    `${API_BASE_URL}/api/stats/dashboard`,
    { timeout: 10000 },
  )

  if (data?.status !== 'success') {
    throw new Error(data?.message || 'El backend respondió con un error')
  }
  return data.data as DashboardStats
}
