import { Box, Flex, Text } from "@chakra-ui/react";
import { FaStore } from "react-icons/fa";

interface Props {
    name: string;
    logoUrl: string;
}

export function RestaurantSelectorVendor({ name, logoUrl }: Props) {
    return (
        <Flex
            justify="center"
            mb={{ base: 5, md: 6, lg: 7 }}
        >
            <Box
                bg="white"
                borderRadius="2xl"
                boxShadow="0 10px 30px rgba(4,46,99,0.10)"
                px={{ base: 5, md: 8, lg: 10 }}
                py={{ base: 4, md: 5, lg: 6 }}
                display="flex"
                alignItems="center"
                gap={{ base: 4, md: 5 }}
                border="1px solid"
                borderColor="blue.50"
                minW={{ base: "280px", md: "400px", lg: "480px" }}
                maxW={{ base: "100%", md: "560px", lg: "720px" }}
                w={{ base: "92%", md: "auto" }}
                transition="box-shadow 0.2s"
                _hover={{ boxShadow: "0 14px 34px rgba(4,46,99,0.14)" }}
            >
                <Box
                    position="relative"
                    flexShrink={0}
                    borderRadius="full"
                    p="4px"
                    bg="linear-gradient(135deg, #2DC6B8 0%, #042E63 100%)"
                >
                    <Box
                        borderRadius="full"
                        overflow="hidden"
                        bg="white"
                        p="3px"
                        w={{ base: "64px", md: "76px", lg: "100px" }}
                        h={{ base: "64px", md: "76px", lg: "100px" }}
                    >
                        <img
                            src={logoUrl}
                            alt={name}
                            width="100%"
                            height="100%"
                            style={{ objectFit: "cover", borderRadius: "9999px", display: "block" }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=80`;
                            }}
                        />
                    </Box>
                </Box>

                <Box>
                    <Flex align="center" gap={1.5} mb={1}>
                        <Box as={FaStore} color="#2DC6B8" boxSize="14px" />
                        <Text
                            fontSize={{ base: "10px", md: "lg" }}
                            color="gray.400"
                            fontWeight="bold"
                            letterSpacing="wide"
                            textTransform="uppercase"
                        >
                            Tu restaurante
                        </Text>
                    </Flex>
                    <Text
                        fontWeight="extrabold"
                        color="#042E63"
                        fontSize={{ base: "xl", md: "2xl", lg: "6xl" }}
                        lineHeight="1.1"
                    >
                        {name}
                    </Text>
                </Box>
            </Box>
        </Flex>
    );
}
