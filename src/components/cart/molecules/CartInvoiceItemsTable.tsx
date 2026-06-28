import { Box, VStack, SimpleGrid, Text, Flex } from "@chakra-ui/react";

export interface InvoiceItemData {
    code: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

interface InvoiceItemsTableProps {
    items: InvoiceItemData[];
}

export const InvoiceItemsTable = ({ items }: InvoiceItemsTableProps) => {
    return (
        <Box mb={6}>
            <Box
                bg="#042E63"
                borderRadius="xl"
                px={{ base: 3, md: 4 }}
                py={2}
                mb={2}
                display={{ base: "none", sm: "block" }}
            >
                <SimpleGrid columns={4} gap={2}>
                    {["CÓDIGO", "ARTÍCULO", "CANT.", "TOTAL"].map((header) => (
                        <Text key={header} fontSize="sm" color="white" fontWeight="bold">
                            {header}
                        </Text>
                    ))}
                </SimpleGrid>
            </Box>

            <VStack gap={0} align="stretch">
                {items.map((item, i) => (
                    <Box
                        key={i}
                        px={{ base: 3, md: 4 }}
                        py={{ base: 3, md: 2 }}
                        bg={i % 2 === 0 ? "gray.50" : "white"}
                        borderRadius={{ base: "lg", sm: "none" }}
                        mb={{ base: 2, sm: 0 }}
                    >
                        <Box display={{ base: "block", sm: "none" }}>
                            <Flex justify="space-between" align="start" mb={1}>
                                <Text fontSize="md" color="#042E63" fontWeight="semibold" flex={1}>
                                    {item.name}
                                </Text>
                                <Text fontSize="md" fontWeight="bold" color="#042E63" ml={2}>
                                    ${(item.unitPrice * item.quantity).toFixed(2)}
                                </Text>
                            </Flex>
                            <Flex gap={3}>
                                <Text fontSize="md" color="gray.400">
                                    Cód. {item.code}
                                </Text>
                                <Text fontSize="md" color="gray.500">
                                    ×{item.quantity} · ${item.unitPrice.toFixed(2)} c/u
                                </Text>
                            </Flex>
                        </Box>

                        <SimpleGrid columns={4} gap={2} display={{ base: "none", sm: "grid" }}>
                            <Text fontSize="md" color="gray.500">
                                {item.code}
                            </Text>
                            <Text fontSize="md" color="#042E63" fontWeight="semibold">
                                {item.name}
                            </Text>
                            <Text fontSize="md" color="gray.600">
                                {item.quantity}
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color="#042E63">
                                ${(item.unitPrice * item.quantity).toFixed(2)}
                            </Text>
                        </SimpleGrid>
                    </Box>
                ))}
            </VStack>

            <Box h="1px" bg="gray.200" w="full" />
        </Box>
    );
};
