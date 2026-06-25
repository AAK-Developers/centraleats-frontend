import { Box, Flex, Text, HStack, VStack, Circle, Icon } from "@chakra-ui/react";
import { FaClock, FaCheckCircle } from "react-icons/fa";
import { MdRestaurant } from "react-icons/md";
import type { ActiveOrder } from "../../context/ActiveOrderContext";

interface ActiveOrderBannerProps {
    order: ActiveOrder;
}

// Stepper step component
const Step = ({
    label,
    isActive,
    isDone,
}: {
    label: string;
    isActive: boolean;
    isDone: boolean;
}) => (
    <HStack gap={2} align="center">
        <Circle
            size="22px"
            bg={isDone ? "#2DC6B8" : isActive ? "white" : "whiteAlpha.300"}
            border="2px solid"
            borderColor={isDone || isActive ? "#2DC6B8" : "whiteAlpha.400"}
        >
            {isDone && <Icon as={FaCheckCircle} color="white" boxSize="12px" />}
            {isActive && <Circle size="10px" bg="#2DC6B8" />}
        </Circle>
        <Text
            fontSize="xs"
            color={isActive ? "white" : isDone ? "#2DC6B8" : "whiteAlpha.600"}
            fontWeight={isActive ? "bold" : "normal"}
        >
            {label}
        </Text>
    </HStack>
);

export const ActiveOrderBanner = ({ order }: ActiveOrderBannerProps) => {
    return (
        <Box
            bg="#042E63"
            borderRadius="2xl"
            p={{ base: 4, md: 6 }}
            mb={8}
            color="white"
            shadow="xl"
            position="relative"
            overflow="hidden"
        >
            {/* Decorative background circle */}
            <Box
                position="absolute"
                top="-30px"
                right="-30px"
                boxSize="160px"
                borderRadius="full"
                bg="whiteAlpha.50"
                pointerEvents="none"
            />

            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "flex-start", md: "center" }}
                gap={4}
            >
                {/* Left: restaurant + product info */}
                <VStack align="flex-start" gap={1}>
                    <HStack gap={2}>
                        <Icon as={MdRestaurant} boxSize="18px" color="#2DC6B8" />
                        <Text fontSize="sm" color="whiteAlpha.800" fontWeight="medium">
                            {order.restaurantName}
                        </Text>
                    </HStack>

                    <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="extrabold">
                        {order.productName}
                    </Text>

                    <HStack gap={2} mt={1}>
                        <Box
                            bg="#2DC6B8"
                            borderRadius="full"
                            px={3}
                            py={1}
                            display="flex"
                            alignItems="center"
                            gap={2}
                        >
                            <Icon as={FaClock} boxSize="12px" />
                            <Text fontSize="xs" fontWeight="bold">
                                {order.estimatedTime}
                            </Text>
                        </Box>
                        <Text fontSize="xs" color="whiteAlpha.600">
                            Acércate al local cuando el estado cambie a "Listo"
                        </Text>
                    </HStack>
                </VStack>

                {/* Right: order status stepper */}
                <Box
                    bg="whiteAlpha.100"
                    borderRadius="xl"
                    p={4}
                    minW={{ base: "full", md: "200px" }}
                >
                    <HStack gap={2} mb={3}>
                        <Icon as={FaCheckCircle} color="#2DC6B8" boxSize="16px" />
                        <Text fontSize="sm" fontWeight="bold" color="#2DC6B8">
                            Pedido Aceptado
                        </Text>
                    </HStack>

                    <VStack align="flex-start" gap={3} pl={1}>
                        {/* Connector line */}
                        <Box position="relative" w="full">
                            <Step label="En Preparación" isActive={true} isDone={false} />
                            {/* vertical line */}
                            <Box
                                position="absolute"
                                left="10px"
                                top="22px"
                                w="2px"
                                h="28px"
                                bg="whiteAlpha.200"
                            />
                        </Box>

                        <Step label="Listo para Retirar" isActive={false} isDone={false} />
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
};