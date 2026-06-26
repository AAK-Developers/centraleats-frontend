import { Flex, Text, Box } from "@chakra-ui/react";
import { ArrowUp, ShoppingBag, CreditCard, ChevronRight } from "lucide-react";

type PaymentMethod = "efectivo" | "tarjeta" | null;

interface CartActionButtonProps {
    paymentMethod: PaymentMethod;
    onClick: () => void;
}

const getConfig = (method: PaymentMethod): { label: string; sublabel: string; icon: React.ReactNode } => {
    if (method === "efectivo") {
        return {
            label: "Enviar Pedido al Restaurante",
            sublabel: "Pagas en efectivo al retirar",
            icon: <ShoppingBag size={20} />,
        };
    }
    if (method === "tarjeta") {
        return {
            label: "Pagar con Tarjeta",
            sublabel: "Serás redirigido al formulario",
            icon: <CreditCard size={20} />,
        };
    }
    return {
        label: "Selecciona un método de pago",
        sublabel: "Efectivo o tarjeta",
        icon: <ChevronRight size={20} />,
    };
};

export const CartActionButton = ({ paymentMethod, onClick }: CartActionButtonProps) => {
    const { label, sublabel, icon } = getConfig(paymentMethod);
    const isActive = !!paymentMethod;

    return (
        <Flex
            as="button"
            w="full"
            align="center"
            justify="space-between"
            bg={isActive ? (paymentMethod === "efectivo" ? "#042E63" : "#30B2BC") : "gray.300"}
            color="white"
            borderRadius="2xl"
            px={{ base: 4, md: 5 }}
            py={{ base: 3, md: 4 }}
            onClick={isActive ? onClick : undefined}
            cursor={isActive ? "pointer" : "not-allowed"}
            transition="all 0.2s"
            _hover={isActive ? { opacity: 0.92, transform: "translateY(-1px)", boxShadow: "lg" } : {}}
            gap={3}
        >
            {/* Left icon */}
            <Flex
                w={{ base: "36px", md: "40px" }}
                h={{ base: "36px", md: "40px" }}
                bg="whiteAlpha.200"
                borderRadius="xl"
                align="center"
                justify="center"
                flexShrink={0}
            >
                {icon}
            </Flex>

            {/* Labels */}
            <Box flex={1} textAlign="left">
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} lineHeight="1.2">
                    {label}
                </Text>
                <Text fontSize={{ base: "10px", md: "xs" }} opacity={0.8} mt={0.5}>
                    {sublabel}
                </Text>
            </Box>

            {/* Arrow */}
            {isActive && (
                <Flex
                    w={{ base: "28px", md: "32px" }}
                    h={{ base: "28px", md: "32px" }}
                    bg="whiteAlpha.300"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    flexShrink={0}
                >
                    <ArrowUp size={18} />
                </Flex>
            )}
        </Flex>
    );
};