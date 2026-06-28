import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FaStoreSlash, FaToggleOn } from "react-icons/fa";

export function ClosedStateVendor() {
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
                    bg="gray.100"
                    opacity={0.6}
                />

                <Flex
                    w={{ base: "80px", md: "100px" }}
                    h={{ base: "80px", md: "100px" }}
                    borderRadius="full"
                    bg="gray.100"
                    align="center"
                    justify="center"
                    position="relative"
                    zIndex={1}
                    border="2px dashed"
                    borderColor="gray.200"
                >
                    <Icon
                        as={FaStoreSlash}
                        boxSize={{ base: "32px", md: "120px" }}
                        color="gray.400"
                    />
                </Flex>
            </Box>

            <Box textAlign="center">
                <Text
                    fontSize={{ base: "xl", md: "3xl" }}
                    fontWeight="extrabold"
                    color="gray.600"
                    mb={2}
                >
                    Local cerrado
                </Text>
                <Text
                    fontSize={{ base: "sm", md: "xl" }}
                    color="gray.400"
                    maxW={{ base: "260px", md: "340px" }}
                    lineHeight="1.6"
                >
                    Activa el interruptor para comenzar a recibir pedidos de los estudiantes en tiempo real.
                </Text>
            </Box>

            <Flex
                align="center"
                gap={2}
                bg="linear-gradient(135deg, #2DC6B8 0%, #1fa89c 100%)"
                borderRadius="full"
                px={5}
                py={2.5}
                boxShadow="0 4px 14px rgba(45,198,184,0.30)"
            >
                <Icon as={FaToggleOn} boxSize={4} color="white" />
                <Text fontSize="slg" fontWeight="bold" color="white">
                    Abre tu local desde arriba
                </Text>
            </Flex>
        </Flex>
    );
}
