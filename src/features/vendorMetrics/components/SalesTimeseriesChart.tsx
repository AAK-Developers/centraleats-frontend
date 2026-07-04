import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Text } from "@chakra-ui/react";
import type { SalesTimeseriesItem } from "../types/vendorMetrics.types";

export function SalesTimeseriesChart({ data }: { data: SalesTimeseriesItem[] }) {
  if (!data || data.length === 0) {
    return (
      <Box h={300} display="flex" alignItems="center" justifyContent="center" bg="gray.50" borderRadius="md">
        <Text color="gray.500">Sin datos para este período</Text>
      </Box>
    );
  }

  // Format data for Recharts
  const formattedData = data.map(item => ({
    ...item,
    revenueDollars: item.revenue / 100
  }));

  return (
    <Box h={300} w="100%" p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" display="flex" flexDirection="column">
      <Text fontSize="md" fontWeight="semibold" mb={2} color="gray.700">Ingresos vs Órdenes</Text>
      <Box flex="1" minH={0}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DC6B8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2DC6B8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(val) => `$${val}`} tick={{ fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'revenueDollars' ? `$${value.toFixed(2)}` : value,
                name === 'revenueDollars' ? 'Ingresos' : 'Órdenes'
              ]}
            />
            <Area type="monotone" dataKey="revenueDollars" stroke="#2DC6B8" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
