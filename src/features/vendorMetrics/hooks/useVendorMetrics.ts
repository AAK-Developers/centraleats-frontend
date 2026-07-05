import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { vendorMetricsApi } from "../api/vendorMetricsApi";
import type { MetricsRange, TimeseriesBucket } from "../types/vendorMetrics.types";

const METRICS_KEYS = {
  all: () => ["vendor-metrics"] as const,
  summary: (range: MetricsRange) => ["vendor-metrics", "summary", range] as const,
  ordersByStatus: (range: MetricsRange) => ["vendor-metrics", "orders-by-status", range] as const,
  salesTimeseries: (range: MetricsRange, bucket: TimeseriesBucket) => ["vendor-metrics", "sales-timeseries", range, bucket] as const,
  topProducts: (range: MetricsRange) => ["vendor-metrics", "top-products", range] as const,
  topCustomers: (range: MetricsRange) => ["vendor-metrics", "top-customers", range] as const,
  recentOrders: () => ["vendor-metrics", "recent-orders"] as const,
};

export function useVendorSummary(range: MetricsRange) {
  return useQuery({
    queryKey: METRICS_KEYS.summary(range),
    queryFn: () => vendorMetricsApi.getSummary(range),
  });
}

export function useVendorOrdersByStatus(range: MetricsRange) {
  return useQuery({
    queryKey: METRICS_KEYS.ordersByStatus(range),
    queryFn: () => vendorMetricsApi.getOrdersByStatus(range),
  });
}

export function useVendorSalesTimeseries(range: MetricsRange, bucket: TimeseriesBucket = "hour") {
  return useQuery({
    queryKey: METRICS_KEYS.salesTimeseries(range, bucket),
    queryFn: () => vendorMetricsApi.getSalesTimeseries(range, bucket),
  });
}

export function useVendorTopProducts(range: MetricsRange) {
  return useQuery({
    queryKey: METRICS_KEYS.topProducts(range),
    queryFn: () => vendorMetricsApi.getTopProducts(range),
  });
}

export function useVendorTopCustomers(range: MetricsRange) {
  return useQuery({
    queryKey: METRICS_KEYS.topCustomers(range),
    queryFn: () => vendorMetricsApi.getTopCustomers(range),
  });
}

export function useVendorRecentOrders() {
  return useQuery({
    queryKey: METRICS_KEYS.recentOrders(),
    queryFn: () => vendorMetricsApi.getRecentOrders(),
  });
}

export function useInvalidateVendorMetrics() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: METRICS_KEYS.all() }),
    [queryClient]
  );
}
