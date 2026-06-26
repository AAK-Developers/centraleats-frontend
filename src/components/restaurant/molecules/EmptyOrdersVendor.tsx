import { Flex, Text } from "@chakra-ui/react";

export function EmptyOrdersVendor() {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            py={{ base: 8, md: 12, lg: 16 }}
            gap={{ base: 2, md: 3 }}
        >
            <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="semibold"
                color="gray.400"
                textAlign="center"
            >
                No hay pedidos en esta sección
            </Text>
            <Text
                fontSize={{ base: "sm", md: "md", lg: "xl" }}
                color="gray.300"
                textAlign="center"
            >
                Los pedidos aparecerán aquí en tiempo real
            </Text>
        </Flex>
    );
}