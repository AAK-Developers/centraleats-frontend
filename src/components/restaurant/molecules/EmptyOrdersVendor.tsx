import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FaClipboardList, FaClock } from "react-icons/fa";

export function EmptyOrdersVendor() {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            py={{ base: 12, md: 20 }}
            gap={6}
        >
            <Box position="relative">
                <Box
                    position="absolute"
                    inset="-12px"
                    borderRadius="full"
                    bg="gray.50"
                    opacity={0.8}
                />
                <Flex
                    w={{ base: "80px", md: "100px" }}
                    h={{ base: "80px", md: "100px" }}
                    borderRadius="full"
                    bg="gray.50"
                    align="center"
                    justify="center"
                    position="relative"
                    zIndex={1}
                    border="2px dashed"
                    borderColor="gray.200"
                >
                    <Icon
                        as={FaClipboardList}
                        boxSize={{ base: "32px", md: "100px" }}
                        color="gray.400"
                    />
                </Flex>
            </Box>

            <Box textAlign="center">
                <Text
                    fontSize={{ base: "xl", md: "4xl" }}
                    fontWeight="extrabold"
                    color="gray.500"
                    mb={2}
                >
                    Sin pedidos por aquí
                </Text>
                <Text
                    fontSize={{ base: "sm", md: "xl" }}
                    color="gray.400"
                    maxW={{ base: "260px", md: "320px" }}
                    lineHeight="1.6"
                >
                    Cuando lleguen nuevos pedidos aparecerán aquí automáticamente.
                </Text>
            </Box>

            <Flex
                align="center"
                gap={2}
                bg="white"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="full"
                px={4}
                py={2}
                boxShadow="sm"
            >
                <Box position="relative" w="8px" h="8px">
                    <Box
                        position="absolute"
                        inset={0}
                        borderRadius="full"
                        bg="#2DC6B8"
                        opacity={0.4}
                        style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }}
                    />
                    <Box
                        position="relative"
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg="#2DC6B8"
                    />
                </Box>
                <Icon as={FaClock} boxSize={3} color="gray.400" />
                <Text fontSize="md" fontWeight="semibold" color="gray.400">
                    Escuchando pedidos en tiempo real
                </Text>
            </Flex>
        </Flex>
    );
}
