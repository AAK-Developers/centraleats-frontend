import { Flex, Text } from "@chakra-ui/react";
import { ArrowUp } from "lucide-react";

type PaymentMethod = "efectivo" | "tarjeta" | null;

interface CartActionButtonProps {
    paymentMethod: PaymentMethod;
    onClick: () => void;
    onSuccess?: () => void;
}

const getLabel = (method: PaymentMethod) => {
    if (method === "efectivo") return "Enviar Pedido!";
    if (method === "tarjeta") return "Ir a pagar!";
    return "Elige un tipo de pago!";
};

export const CartActionButton = ({ paymentMethod, onClick }: CartActionButtonProps) => {
    const handleClick = () => {
        if (!paymentMethod) return;
        onClick();
    };

    return (
        <Flex
            as="button"
            w="full"
            align="center"
            justify="space-between"
            bg={paymentMethod ? "#30B2BC" : "gray.400"}
            color="white"
            borderRadius="full"
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
            fontWeight="bold"
            fontSize={{ base: "md", md: "2xl" }}
            onClick={handleClick}
            cursor={paymentMethod ? "pointer" : "not-allowed"}
            transition="all 0.2s"
        >
            <Text>{getLabel(paymentMethod)}</Text>
            <Flex
                w={{ base: "28px", md: "32px" }}
                h={{ base: "28px", md: "32px" }}
                bg="white"
                borderRadius="full"
                align="center"
                justify="center"
            >
                <ArrowUp
                    size={26}
                    color={paymentMethod ? "#30B2BC" : "#919497"}
                />
            </Flex>
        </Flex>
    );
};