import { Box, Flex, Text, Icon, VStack } from "@chakra-ui/react";
import { HiX } from "react-icons/hi";
import type { CartToastData } from "../../../hooks/useCartToast";

interface CartAddedToastProps {
    toasts: CartToastData[];
    onDismiss: (id: string) => void;
}

const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const CartAddedToast = ({ toasts, onDismiss }: CartAddedToastProps) => {
    if (toasts.length === 0) return null;

    return (
        <Box
            position="fixed"
            top={{ base: "16px", md: "24px" }}
            right={{ base: "16px", md: "24px" }}
            zIndex={1400}
            pointerEvents="none"
        >
            <VStack gap={3} align="flex-end">
                {toasts.map((toast, index) => (
                    <Flex
                        key={toast.id}
                        pointerEvents="auto"
                        align="center"
                        gap={3}
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="0 12px 32px rgba(4,46,99,0.18)"
                        border="1px solid"
                        borderColor="blackAlpha.50"
                        pl={3}
                        pr={4}
                        py={3}
                        w={{ base: "calc(100vw - 32px)", sm: "360px" }}
                        maxW="360px"
                        position="relative"
                        overflow="hidden"
                        css={{
                            animation: "cartToastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                        style={{ zIndex: 1400 - index }}
                    >
                        <Box
                            position="absolute"
                            left={0}
                            top={0}
                            bottom={0}
                            w="4px"
                            bg="linear-gradient(180deg, #2DC6B8 0%, #042E63 100%)"
                        />

                        <Box flex={1} minW={0}>
                            <Text fontSize="md" color="#2DC6B8" fontWeight="bold" letterSpacing="wide" mb={0.5}>
                                AGREGADO AL CARRITO
                            </Text>
                            <Text fontSize="md" fontWeight="bold" color="#042E63" lineClamp={1}>
                                {toast.productName}
                            </Text>
                            <Flex justify="space-between" align="center" mt={0.5}>
                                <Text fontSize="md" color="gray.400" lineClamp={1}>
                                    {toast.vendorName}
                                </Text>
                                <Text fontSize="lg" fontWeight="bold" color="#F97316" flexShrink={0} ml={2}>
                                    {formatPrice(toast.price)}
                                </Text>
                            </Flex>
                        </Box>

                        <Flex
                            as="button"
                            onClick={() => onDismiss(toast.id)}
                            w="22px"
                            h="22px"
                            borderRadius="full"
                            align="center"
                            justify="center"
                            color="gray.400"
                            flexShrink={0}
                            _hover={{ bg: "gray.100", color: "gray.600" }}
                            transition="all 0.15s"
                        >
                            <Icon as={HiX} boxSize={3.5} />
                        </Flex>
                    </Flex>
                ))}
            </VStack>

            <style>
                {`
                    @keyframes cartToastSlideIn {
                        from {
                            opacity: 0;
                            transform: translateX(24px) scale(0.96);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0) scale(1);
                        }
                    }
                `}
            </style>
        </Box>
    );
};
