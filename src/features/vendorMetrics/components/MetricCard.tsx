import { Box, Text } from "@chakra-ui/react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <Box p={5} shadow="sm" borderWidth="1px" borderRadius="lg" bg="white" w="100%">
      <Text fontSize="sm" color="gray.500" mb={1}>{label}</Text>
      <Text fontSize="2xl" fontWeight="bold" color="gray.800">{value}</Text>
      {subtitle && <Text fontSize="xs" color="gray.400" mt={1}>{subtitle}</Text>}
    </Box>
  );
}
