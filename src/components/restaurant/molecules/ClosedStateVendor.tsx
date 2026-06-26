import { Flex, Text, Icon } from "@chakra-ui/react";
import { FaRegFrown } from "react-icons/fa";

export function ClosedStateVendor() {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            py={{ base: 10, md: 16, lg: 20 }}
            gap={{ base: 3, md: 4 }}
        >
            <Icon
                as={FaRegFrown}
                boxSize={{ base: "50px", md: "64px", lg: "80px" }}
                color="gray.400"
            />
            <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="semibold"
                color="gray.500"
                textAlign="center"
            >
                El local se encuentra cerrado
            </Text>
            <Text
                fontSize={{ base: "sm", md: "md", lg: "xl" }}
                color="gray.400"
                textAlign="center"
                maxW={{ base: "280px", md: "360px", lg: "420px" }}
            >
                Activa el interruptor superior para empezar a recibir
                pedidos de los estudiantes en tiempo real
            </Text>
        </Flex>
    );
}