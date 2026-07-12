import { useState } from "react";
import { Box, Flex, Grid, Heading, Spinner, IconButton, Spacer, Center, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft as ArrowLeft } from "react-icons/fa";
import { WaveLayout } from "../../components/layout/WaveLayout";
import { AppContainer } from "../../components/layout/AppContainer";
import { useVendorRestaurant } from "../../hooks/useVendorRestaurant";
import type { MetricsRange, TimeseriesBucket } from "../../features/vendorMetrics/types/vendorMetrics.types";
import {
  useVendorSummary,
  useVendorOrdersByStatus,
  useVendorSalesTimeseries,
  useVendorTopProducts,
  useVendorTopCustomers,
  useVendorRecentOrders,
} from "../../features/vendorMetrics/hooks/useVendorMetrics";
import { useVendorMetricsSocket } from "../../features/vendorMetrics/hooks/useVendorMetricsSocket";
import {
  MetricCard,
  SalesTimeseriesChart,
  OrdersByStatusChart,
  TopProductsChart,
  TopCustomersTable,
  RecentOrdersList,
  MetricsRangeSelector,
} from "../../features/vendorMetrics/components";
import { formatCentsToDollars } from "../../features/vendorMetrics/utils/formatters";

export default function VendorMetricsPage() {
  // Initialize Socket.IO connection for real-time invalidation
  useVendorMetricsSocket();

  const navigate = useNavigate();
  const [range, setRange] = useState<MetricsRange>("today");
  const bucket: TimeseriesBucket = range === "today" ? "hour" : "day";

  const { restaurant } = useVendorRestaurant();

  const summaryQuery = useVendorSummary(range);
  const ordersByStatusQuery = useVendorOrdersByStatus(range);
  const salesTimeseriesQuery = useVendorSalesTimeseries(range, bucket);
  const topProductsQuery = useVendorTopProducts(range);
  const topCustomersQuery = useVendorTopCustomers(range);
  const recentOrdersQuery = useVendorRecentOrders();

  const isLoading =
    summaryQuery.isLoading ||
    ordersByStatusQuery.isLoading ||
    salesTimeseriesQuery.isLoading ||
    topProductsQuery.isLoading ||
    topCustomersQuery.isLoading ||
    recentOrdersQuery.isLoading;

  const isError =
    summaryQuery.isError &&
    ordersByStatusQuery.isError &&
    salesTimeseriesQuery.isError &&
    topProductsQuery.isError &&
    topCustomersQuery.isError &&
    recentOrdersQuery.isError;

  const refetchAll = () => {
    summaryQuery.refetch();
    ordersByStatusQuery.refetch();
    salesTimeseriesQuery.refetch();
    topProductsQuery.refetch();
    topCustomersQuery.refetch();
    recentOrdersQuery.refetch();
  };

  return (
    <WaveLayout>
      <AppContainer>
        <Box py={8}>
          <Flex alignItems="center" mb={6} flexWrap="wrap" gap={4}>
            <Flex alignItems="center">
              <IconButton
                aria-label="Volver"
                variant="ghost"
                onClick={() => navigate("/vendor-dashboard")}
                mr={4}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <Heading size="lg" color="primaryBlue">
                {restaurant?.name ? `${restaurant.name} - Métricas` : "Métricas del Local"}
              </Heading>
            </Flex>
            <Spacer />
            <MetricsRangeSelector value={range} onChange={setRange} />
          </Flex>

          {isError ? (
            <Center py={20} flexDirection="column">
              <Text color="red.500" mb={4}>Ocurrió un error al cargar las métricas.</Text>
              <Button onClick={refetchAll} colorPalette="blue">Reintentar</Button>
            </Center>
          ) : isLoading ? (
            <Center py={20}>
              <Spinner size="xl" color="primaryOrange" />
            </Center>
          ) : (
            <Box display="flex" flexDirection="column" gap={6}>
              {/* Summary Cards */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
                <MetricCard
                  label="Ingresos"
                  value={formatCentsToDollars(summaryQuery.data?.totalRevenue || 0)}
                />
                <MetricCard
                  label="Órdenes Completadas"
                  value={summaryQuery.data?.totalOrders || 0}
                />
                <MetricCard
                  label="Ticket Promedio"
                  value={formatCentsToDollars(summaryQuery.data?.averageTicket || 0)}
                />
                <MetricCard
                  label="Órdenes Activas"
                  value={summaryQuery.data?.activeOrders || 0}
                />
              </Grid>

              {/* Charts Row 1 */}
              <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                <SalesTimeseriesChart data={salesTimeseriesQuery.data || []} />
                <OrdersByStatusChart data={ordersByStatusQuery.data || []} />
              </Grid>

              {/* Charts Row 2 */}
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <TopProductsChart data={topProductsQuery.data || []} />
                <TopCustomersTable data={topCustomersQuery.data || []} />
              </Grid>

              {/* Recent Orders */}
              <RecentOrdersList data={recentOrdersQuery.data || []} />
            </Box>
          )}
        </Box>
      </AppContainer>
    </WaveLayout>
  );
}
