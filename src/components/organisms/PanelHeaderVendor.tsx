import { Flex, Text } from "@chakra-ui/react";
import { StatusToggleVendor } from "../molecules/StatusToggleVendor";

interface Props {
    restaurantName: string;
    isOpen: boolean;
    onToggle: () => void;
}

export function PanelHeaderVendor({ restaurantName, isOpen, onToggle }: Props) {
    return (
        <Flex
            justify="space-between"
            align="center"
            mb={{ base: 4, md: 5, lg: 6 }}
            gap={{ base: 2, md: 4 }}
            flexWrap="wrap"
            px={{ base: 2, md: 4, lg: 0 }}
        >
            <Text
                fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                fontWeight="bold"
                color="#042E63"
            >
                Panel: {restaurantName}
            </Text>

            <StatusToggleVendor isOpen={isOpen} onToggle={onToggle} />
        </Flex>
    );
}