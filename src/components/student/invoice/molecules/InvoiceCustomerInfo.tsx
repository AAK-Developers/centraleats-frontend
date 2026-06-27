import { Box, SimpleGrid, Text } from "@chakra-ui/react";

interface InvoiceCustomerInfoProps {
    customerName: string;
    customerAddress: string;
    paymentMethod: string;
}

export const InvoiceCustomerInfo = ({
    customerName,
    customerAddress,
    paymentMethod,
}: InvoiceCustomerInfoProps) => {
    return (
        <Box
            bg="gray.50"
            borderRadius="xl"
            p={{ base: 3, md: 4 }}
            mb={6}
            border="1px solid"
            borderColor="gray.100"
        >
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={{ base: 3, md: 3 }}>
                <Box>
                    <Text fontSize="md" color="gray.500" fontWeight="semibold" mb={1}>
                        CLIENTE
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color="#042E63">
                        {customerName}
                    </Text>
                </Box>

                <Box>
                    <Text fontSize="md" color="gray.500" fontWeight="semibold" mb={1}>
                        DOMICILIO
                    </Text>
                    <Text fontSize="md" color="gray.600">
                        {customerAddress}
                    </Text>
                </Box>

                <Box>
                    <Text fontSize="md" color="gray.500" fontWeight="semibold" mb={1}>
                        MÉTODO DE PAGO
                    </Text>
                    <Text fontSize="md" fontWeight="bold" color="#30B2BC">
                        {paymentMethod}
                    </Text>
                </Box>

                <Box>
                    <Text fontSize="md" color="gray.500" fontWeight="semibold" mb={1}>
                        ESTADO
                    </Text>
                    <Box
                        display="inline-block"
                        bg="green.100"
                        color="green.700"
                        borderRadius="full"
                        px={3}
                        py={0.5}
                        fontSize="md"
                        fontWeight="bold"
                    >
                        Confirmado
                    </Box>
                </Box>
            </SimpleGrid>
        </Box>
    );
};
