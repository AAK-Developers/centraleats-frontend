import { Flex, HStack, Text } from "@chakra-ui/react";
import { Banknote, CreditCard, ArrowRight } from "lucide-react";

type PaymentMethod = "efectivo" | "tarjeta" | null;

interface PaymentMethodSelectorProps {
    selected: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ selected, onChange }: PaymentMethodSelectorProps) => (
    <HStack gap={{ base: 2, md: 3 }}>
        <Flex
            as="button"
            flex={1}
            align="center"
            justify="center"
            gap={2}
            p={{ base: 2, md: 3 }}
            border="2px solid"
            borderColor={selected === "efectivo" ? "#042E63" : "gray.400"}
            bg={selected === "efectivo" ? "#042E63" : "white"}
            borderRadius="xl"
            onClick={() => onChange("efectivo")}
            transition="all 0.2s"
        >
            <Banknote
                size={24}
                color={selected === "efectivo" ? "white" : "#042E63"}
            />
            <Text
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "lg" }}
                color={selected === "efectivo" ? "white" : "#042E63"}
            >
                Efectivo
            </Text>
        </Flex>

        <Flex
            as="button"
            flex={1}
            align="center"
            justify="center"
            gap={2}
            p={{ base: 2, md: 3 }}
            border="2px solid"
            borderColor={selected === "tarjeta" ? "#30B2BC" : "gray.400"}
            bg={selected === "tarjeta" ? "#30B2BC" : "white"}
            borderRadius="xl"
            onClick={() => onChange("tarjeta")}
            transition="all 0.2s"
        >
            <CreditCard
                size={22}
                color={selected === "tarjeta" ? "white" : "#042E63"}
            />
            <Text
                textAlign="center"
                fontWeight="semibold"
                fontSize={{ base: "sm", md: "lg" }}
                color={selected === "tarjeta" ? "white" : "#042E63"}
            >
                Tarjeta
            </Text>
            <Flex
                w={{ base: "20px", md: "24px" }}
                h={{ base: "20px", md: "24px" }}
                bg="white"
                borderRadius="full"
                align="center"
                justify="center"
                ml="auto"
            >
                <ArrowRight
                    size={15}
                    color={selected === "tarjeta" ? "#30B2BC" : "gray"}
                />
            </Flex>
        </Flex>
    </HStack>
);