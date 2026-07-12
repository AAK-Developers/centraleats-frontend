import { apiClient } from "../../../api/axiosConfig";
import type {
  MetricsRange,
  TimeseriesBucket,
  VendorMetricsSummary,
  OrdersByStatusItem,
  SalesTimeseriesItem,
  TopProductItem,
  TopCustomerItem,
  RecentVendorOrder,
} from "../types/vendorMetrics.types";

const BASE = "/api/metrics/vendor";

export const vendorMetricsApi = {
  getSummary: async (range: MetricsRange): Promise<VendorMetricsSummary> => {
    const res = await apiClient.get(`${BASE}/summary`, { params: { range } });
    return res.data.data;
  },
  getOrdersByStatus: async (range: MetricsRange): Promise<OrdersByStatusItem[]> => {
    const res = await apiClient.get(`${BASE}/orders-by-status`, { params: { range } });
    return res.data.data;
  },
  getSalesTimeseries: async (range: MetricsRange, bucket: TimeseriesBucket): Promise<SalesTimeseriesItem[]> => {
    const res = await apiClient.get(`${BASE}/sales-timeseries`, { params: { range, bucket } });
    return res.data.data;
  },
  getTopProducts: async (range: MetricsRange, limit = 10): Promise<TopProductItem[]> => {
    const res = await apiClient.get(`${BASE}/top-products`, { params: { range, limit } });
    return res.data.data;
  },
  getTopCustomers: async (range: MetricsRange, limit = 10): Promise<TopCustomerItem[]> => {
    const res = await apiClient.get(`${BASE}/top-customers`, { params: { range, limit } });
    return res.data.data;
  },
  getRecentOrders: async (limit = 10): Promise<RecentVendorOrder[]> => {
    const res = await apiClient.get(`${BASE}/recent-orders`, { params: { limit } });
    return res.data.data;
  },
};
