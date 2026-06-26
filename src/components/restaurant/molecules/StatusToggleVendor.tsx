import { Box, Flex, Text } from "@chakra-ui/react";

interface Props {
    isOpen: boolean;
    onToggle: () => void;
}

export function StatusToggleVendor({ isOpen, onToggle }: Props) {
    return (
        <Flex
            as="label"
            align="center"
            gap={{ base: 1, md: 2 }}
            bg={isOpen ? "#2DC6B8" : "gray.400"}
            color="white"
            borderRadius="full"
            px={{ base: 3, md: 4 }}
            py={{ base: 1.5, md: 2 }}
            cursor="pointer"
            style={{ transition: "background 0.3s" }}
        >
            <input
                type="checkbox"
                checked={isOpen}
                onChange={onToggle}
                style={{ display: "none" }}
            />

            <Box
                w={{ base: "28px", md: "32px", lg: "36px" }}
                h={{ base: "16px", md: "18px", lg: "20px" }}
                bg={isOpen ? "whiteAlpha.400" : "whiteAlpha.300"}
                borderRadius="full"
                position="relative"
            >
                <Box
                    position="absolute"
                    top="2px"
                    left={isOpen
                        ? { base: "14px", md: "16px", lg: "18px" }
                        : "2px"
                    }
                    w={{ base: "12px", md: "14px", lg: "16px" }}
                    h={{ base: "12px", md: "14px", lg: "16px" }}
                    bg="white"
                    borderRadius="full"
                    style={{ transition: "left 0.2s" }}
                />
            </Box>

            <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "md", lg: "xl" }}
            >
                {isOpen ? "Abierto" : "Cerrado"}
            </Text>
        </Flex>
    );
}