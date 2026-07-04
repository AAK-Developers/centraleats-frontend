import { Box, Text, Stack, Badge, Flex, Spacer } from "@chakra-ui/react";
import type { RecentVendorOrder } from "../types/vendorMetrics.types";
import { formatCentsToDollars, getStatusColor, getStatusLabel } from "../utils/formatters";

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const diffInMs = new Date().getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  if (diffInMins < 60) return `hace ${Math.max(0, diffInMins)} min`;
  const diffInHours = Math.floor(diffInMins / 60);
  if (diffInHours < 24) return `hace ${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} días`;
};

export function RecentOrdersList({ data }: { data: RecentVendorOrder[] }) {
  if (!data || data.length === 0) {
    return (
      <Box p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500">No hay órdenes recientes</Text>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px">
      <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">Órdenes Recientes</Text>
      <Stack spacing={3}>
        {data.slice(0, 10).map((order) => (
          <Box key={order.id} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Flex alignItems="center" mb={2}>
              <Badge bg={getStatusColor(order.status)} color="white">
                {getStatusLabel(order.status)}
              </Badge>
              <Spacer />
              <Text fontSize="xs" color="gray.500">
                {getRelativeTime(order.createdAt)}
              </Text>
            </Flex>
            <Flex alignItems="baseline">
              <Text fontSize="sm" fontWeight="semibold">
                {order.pickupCode ? `Código: ${order.pickupCode}` : `Orden ID: ${order.id.slice(0, 8)}`}
              </Text>
              <Spacer />
              <Text fontSize="sm" fontWeight="bold" color="gray.800">
                {formatCentsToDollars(order.totalAmount)}
              </Text>
            </Flex>
            <Text fontSize="xs" color="gray.600" mt={1}>
              {order.items.map(item => `${item.quantity}x ${item.productName}`).join(", ")}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
