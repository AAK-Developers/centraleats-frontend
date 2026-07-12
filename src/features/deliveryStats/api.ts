import { apiClient } from '../../api/axiosConfig'
import type { DashboardApiResponse, DashboardStats } from './types'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const { data } = await apiClient.get<DashboardApiResponse>(
      `/api/stats/dashboard`,
      { timeout: 10000 },
    )

    if (data?.status !== 'success') {
      throw new Error(data?.message || 'El backend respondió con un error')
    }
    return data.data as DashboardStats
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para ver las estadísticas.')
    }
    throw error
  }
}
