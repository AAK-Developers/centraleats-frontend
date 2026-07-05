import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";
import type { TopProductItem } from "../types/vendorMetrics.types";

export function TopProductsChart({ data }: { data: TopProductItem[] }) {
  if (!data || data.length === 0) {
    return (
      <Box h={350} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="md">
        <Text color="gray.500">Sin datos para este período</Text>
      </Box>
    );
  }

  const formattedData = data.map(item => ({
    name: item.productName.length > 20 ? item.productName.substring(0, 20) + "..." : item.productName,
    "Cantidad Vendida": item.totalSold
  }));

  return (
    <Box h={350} w="100%" p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" display="flex" flexDirection="column">
      <Text fontSize="md" fontWeight="semibold" mb={2} color="gray.700">Top Productos Vendidos</Text>
      <Box flex="1" minH={0}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="Cantidad Vendida" fill="#2DC6B8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
