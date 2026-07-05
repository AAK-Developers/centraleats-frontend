export type MetricsRange = "today" | "7d" | "30d";
export type TimeseriesBucket = "hour" | "day";

export interface VendorMetricsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageTicket: number;
  activeOrders: number;
}

export interface OrdersByStatusItem {
  status: string;
  count: number;
}

export interface SalesTimeseriesItem {
  bucket: string;
  revenue: number;
  orders: number;
}

export interface TopProductItem {
  productId: string;
  productName: string;
  imageUrl: string | null;
  totalSold: number;
  totalRevenue: number;
}

export interface TopCustomerItem {
  userId: string;
  fullName: string;
  totalOrders: number;
  totalSpent: number;
}

export interface RecentVendorOrder {
  id: string;
  status: string;
  totalAmount: number;
  pickupCode: string | null;
  createdAt: string;
  items: { productName: string; quantity: number }[];
}
