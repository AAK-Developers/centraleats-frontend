import { Box, Flex, HStack, Text, Icon } from "@chakra-ui/react";
import { HiShoppingCart } from "react-icons/hi";
import { CloseButton } from "../atoms/CloseButton";

interface CartPanelHeaderProps {
    title: string;
    showCloseButton: boolean;
    onClose: () => void;
}

export const CartPanelHeader = ({ title, showCloseButton, onClose }: CartPanelHeaderProps) => (
    <Box position="relative" p={5} bg="#042E63" borderBottom="1px solid" borderColor="blue.900">
        <Flex justify="center" align="center">
            <HStack gap={2}>
                <Icon as={HiShoppingCart} boxSize={8} color="white" />
                <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }} color="white">
                    {title}
                </Text>
            </HStack>
        </Flex>
        {showCloseButton && (
            <Box position="absolute" right={4} top="50%" transform="translateY(-50%)">
                <CloseButton onClick={onClose} />
            </Box>
        )}
    </Box>
);
