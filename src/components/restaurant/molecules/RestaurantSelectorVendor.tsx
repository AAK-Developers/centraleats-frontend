import { Box, Flex, Text } from "@chakra-ui/react";

interface Props {
    name: string;
    logoUrl: string;
}

export function RestaurantSelectorVendor({ name, logoUrl }: Props) {
    return (
        <Flex
            justify="center"
            mb={{ base: 4, md: 5, lg: 6 }}
        >
            <Box
                bg="white"
                borderRadius="lg"
                shadow="md"
                px={{ base: 4, md: 6, lg: 8 }}
                py={{ base: 3, md: 4, lg: 6 }}
                display="flex"
                alignItems="center"
                gap={{ base: 3, md: 4 }}
                border="1px solid"
                borderColor="gray.200"
                minW={{ base: "260px", md: "340px", lg: "420px" }}
                maxW={{ base: "100%", md: "500px", lg: "640px" }}
                w={{ base: "90%", md: "auto" }}
            >
                <img
                    src={logoUrl}
                    alt={name}
                    width={50}
                    height={50}
                    style={{ objectFit: "contain", borderRadius: "6px" }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=50`;
                    }}
                />
                <Text
                    fontWeight="semibold"
                    color="#042E63"
                    fontSize={{ base: "md", md: "xl", lg: "2xl" }}
                >
                    {name}
                </Text>
            </Box>
        </Flex>
    );
}