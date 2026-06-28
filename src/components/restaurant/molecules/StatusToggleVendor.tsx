import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FaCheckCircle, FaPowerOff } from "react-icons/fa";

interface Props {
    isOpen: boolean;
    onToggle: () => void;
}

export function StatusToggleVendor({ isOpen, onToggle }: Props) {
    return (
        <Flex
            as="label"
            align="center"
            gap={{ base: 2, md: 3 }}
            bg={isOpen ? "linear-gradient(135deg, #2DC6B8 0%, #25a89c 100%)" : "gray.400"}
            color="white"
            borderRadius="full"
            px={{ base: 4, md: 5 }}
            py={{ base: 2, md: 2.5 }}
            cursor="pointer"
            boxShadow={isOpen ? "0 6px 16px rgba(45,198,184,0.4)" : "0 4px 10px rgba(0,0,0,0.12)"}
            transition="all 0.3s ease"
            _hover={{ transform: "translateY(-1px)" }}
        >
            <input
                type="checkbox"
                checked={isOpen}
                onChange={onToggle}
                style={{ display: "none" }}
            />

            <Icon
                as={isOpen ? FaCheckCircle : FaPowerOff}
                boxSize={{ base: 3.5, md: 4 }}
            />

            <Box
                w={{ base: "34px", md: "40px", lg: "44px" }}
                h={{ base: "19px", md: "22px", lg: "24px" }}
                bg="whiteAlpha.300"
                borderRadius="full"
                position="relative"
                border="1px solid"
                borderColor="whiteAlpha.400"
            >
                <Box
                    position="absolute"
                    top="2px"
                    left={isOpen
                        ? { base: "16px", md: "19px", lg: "21px" }
                        : "2px"
                    }
                    w={{ base: "14px", md: "16px", lg: "18px" }}
                    h={{ base: "14px", md: "16px", lg: "18px" }}
                    bg="white"
                    borderRadius="full"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                    transition="left 0.25s ease"
                />
            </Box>

            <Text
                fontWeight="bold"
                fontSize={{ base: "sm", md: "md", lg: "lg" }}
                letterSpacing="wide"
            >
                {isOpen ? "Abierto" : "Cerrado"}
            </Text>
        </Flex>
    );
}
