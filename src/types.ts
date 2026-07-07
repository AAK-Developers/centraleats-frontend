export interface DashboardSummary {
  restaurants: number
  products: number
  completedOrders: number
  totalRevenue: number
  averageTicket: number
  averageDeliveryTime: number
}

export interface TopRestaurant {
  vendorId: string
  vendorName: string
  completedOrders: number
  totalRevenue: number
}

export interface TopProduct {
  productId: string
  productName: string
  imageUrl: string | null
  vendorName: string
  totalSold: number
}

export interface CategoryStat {
  category: string
  totalSold: number
}

export interface OrdersByHour {
  hour: number
  orders: number
}

export interface DeliveryRankingEntry {
  vendorId: string
  vendorName: string
  averageMinutes: number
}

export interface StatusDistributionEntry {
  status: string
  total: number
}

export interface RecentOrder {
  id: string
  vendor: string
  total: number
  createdAt: string
  status: string
}

export interface DashboardStats {
  generatedAt: string
  summary: DashboardSummary
  topRestaurants: TopRestaurant[]
  topProducts: TopProduct[]
  categories: CategoryStat[]
  ordersByHour: OrdersByHour[]
  ordersByWeekday: unknown[]
  deliveryRanking: DeliveryRankingEntry[]
  statusDistribution: StatusDistributionEntry[]
  recentOrders: RecentOrder[]
}

export interface DashboardApiResponse {
  success: boolean
  data: DashboardStats
}
