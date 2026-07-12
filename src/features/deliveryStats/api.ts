import axios from 'axios'
import type { DashboardApiResponse, DashboardStats } from './types'
import { VITE_API_BASE_URL } from '../../config/env'

// Cliente axios aislado exclusivo para móvil (no manda cookies, ni interceptores de Clerk)
const mobileApiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
})

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const { data } = await mobileApiClient.get<DashboardApiResponse>(
      `/api/stats/dashboard`,
      { timeout: 10000 },
    )

    if (data?.status !== 'success') {
      throw new Error(data?.message || 'El backend respondió con un error')
    }
    return data.data as DashboardStats
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para ver las estadísticas.', { cause: error })
    }
    throw error
  }
}
