import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import type { TopCustomerItem } from "../types/vendorMetrics.types";
import { formatCentsToDollars } from "../utils/formatters";

export function TopCustomersTable({ data }: { data: TopCustomerItem[] }) {
  if (!data || data.length === 0) {
    return (
      <Box p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500">Sin datos para este período</Text>
      </Box>
    );
  }

  return (
    <Box p={4} bg="white" shadow="sm" borderRadius="lg" borderWidth="1px" overflow="hidden">
      <Text fontSize="md" fontWeight="semibold" mb={4} color="gray.700">Top Clientes</Text>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Nombre</Th>
              <Th isNumeric>Órdenes</Th>
              <Th isNumeric>Total Gastado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.slice(0, 10).map((customer, index) => (
              <Tr key={customer.userId}>
                <Td>{index + 1}</Td>
                <Td>{customer.fullName}</Td>
                <Td isNumeric>{customer.totalOrders}</Td>
                <Td isNumeric>{formatCentsToDollars(customer.totalSpent)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
