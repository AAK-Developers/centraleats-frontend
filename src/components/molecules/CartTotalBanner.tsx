import { Flex, Text } from "@chakra-ui/react";

interface CartTotalBannerProps {
    total: number;
}

export const CartTotalBanner = ({ total }: CartTotalBannerProps) => (
    <Flex
        bg="#F97316"
        borderRadius="xl"
        px={{ base: 3, md: 4 }}
        py={{ base: 3, md: 3 }}
        justify="space-between"
        align="center"
        gap={3}
    >
        <Text
            color="white"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md" }}
        >
            Total a pagar
        </Text>

        <Text
            color="white"
            fontWeight="bold"
            fontSize={{ base: "lg", md: "xl" }}
            whiteSpace="nowrap"
        >
            ${total.toFixed(2)}
        </Text>
    </Flex>
);