import { Box, Text, Table } from "@chakra-ui/react";
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
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>#</Table.ColumnHeader>
            <Table.ColumnHeader>Nombre</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Órdenes</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Total Gastado</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.slice(0, 10).map((customer, index) => (
            <Table.Row key={customer.userId}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{customer.fullName}</Table.Cell>
              <Table.Cell textAlign="end">{customer.totalOrders}</Table.Cell>
              <Table.Cell textAlign="end">{formatCentsToDollars(customer.totalSpent)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
