import { Flex, VStack, HStack, Text } from "@chakra-ui/react";

interface InvoiceHeaderProps {
    restaurantName: string;
    invoiceNumber: string;
    date: string;
}

export const InvoiceHeader = ({
    restaurantName,
    invoiceNumber,
    date,
}: InvoiceHeaderProps) => {
    return (
        <Flex
            justify="space-between"
            align={{ base: "center", md: "start" }}
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 3, sm: 0 }}
            mb={6}
        >
            <VStack align={{ base: "center", sm: "start" }} gap={1}>
                <Text fontSize="xs" color="gray.500" fontWeight="semibold">
                    RESTAURANTE
                </Text>
                <Text fontWeight="bold" color="#042E63" fontSize={{ base: "md", md: "lg" }}>
                    {restaurantName}
                </Text>
            </VStack>

            <VStack align={{ base: "center", sm: "end" }} gap={1}>
                <Text
                    fontWeight="bold"
                    fontSize={{ base: "xl", md: "2xl" }}
                    color="#30B2BC"
                    letterSpacing="widest"
                >
                    FACTURA
                </Text>
                <HStack gap={2}>
                    <Text fontSize="xs" color="gray.500">N° FACTURA</Text>
                    <Text fontSize="xs" fontWeight="bold" color="#042E63">
                        {invoiceNumber}
                    </Text>
                </HStack>
                <HStack gap={2}>
                    <Text fontSize="xs" color="gray.500">FECHA</Text>
                    <Text fontSize="xs" fontWeight="bold" color="#042E63">
                        {date}
                    </Text>
                </HStack>
            </VStack>
        </Flex>
    );
};
