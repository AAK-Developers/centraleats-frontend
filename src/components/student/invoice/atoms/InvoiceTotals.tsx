import { Box, Flex, VStack, Text } from "@chakra-ui/react";

interface InvoiceTotalsProps {
    subtotal: number;
    amountPaid: number;
    change: number;
}

export const InvoiceTotals = ({
    subtotal,
    amountPaid,
    change,
}: InvoiceTotalsProps) => {
    return (
        <VStack align="stretch" gap={2} px={{ base: 3, md: 4 }} pt={2}>
            <Flex justify="space-between">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">SUBTOTAL</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="#042E63">
                    ${subtotal.toFixed(2)}
                </Text>
            </Flex>

            <Flex justify="space-between">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">PAGA CON</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="#042E63">
                    ${amountPaid.toFixed(2)}
                </Text>
            </Flex>

            <Flex justify="space-between">
                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.500">VUELTAS</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="#042E63">
                    ${change.toFixed(2)}
                </Text>
            </Flex>

            <Box />

            <Flex
                justify="space-between"
                bg="#042E63"
                borderRadius="xl"
                px={{ base: 3, md: 4 }}
                py={{ base: 2, md: 3 }}
            >
                <Text fontWeight="bold" color="white" fontSize={{ base: "sm", md: "md" }}>
                    TOTAL FACTURA
                </Text>
                <Text fontWeight="bold" color="white" fontSize={{ base: "sm", md: "md" }}>
                    ${subtotal.toFixed(2)}
                </Text>
            </Flex>
        </VStack>
    );
};
