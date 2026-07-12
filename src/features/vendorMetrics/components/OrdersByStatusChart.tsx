import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";
import type { OrdersByStatusItem } from "../types/vendorMetrics.types";
import { getStatusColor, getStatusLabel } from "../utils/formatters";

export function OrdersByStatusChart({ data }: { data: OrdersByStatusItem[] }) {
  if (!data || data.length === 0) {
    return (
      <Box h={300} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="md">
        <Text color="gray.500">Sin datos para este período</Text>
      </Box>
    );
  }

  const chartData = data.map(item => ({
    name: getStatusLabel(item.status),
    value: item.count,
    color: getStatusColor(item.status)
  }));

  return (
    <Box h={300} w="100%" p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" display="flex" flexDirection="column">
      <Text fontSize="md" fontWeight="semibold" mb={2} color="gray.700">Órdenes por Estado</Text>
      <Box flex="1" minH={0}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
