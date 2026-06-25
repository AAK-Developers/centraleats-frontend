import { Box, Flex } from "@chakra-ui/react";

export type OrderTab = "nuevos" | "en_cocina" | "listos" | "platos";

interface Tab {
    key: OrderTab;
    label: string;
    count: number;
}

interface Props {
    tabs: Tab[];
    activeTab: OrderTab;
    onTabChange: (tab: OrderTab) => void;
}

export function OrderTabsVendor({ tabs, activeTab, onTabChange }: Props) {
    return (
        <Flex
            gap={{ base: 2, md: 3 }}
            mb={{ base: 4, md: 6 }}
            flexWrap="wrap"
            justifyContent="center"
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <Box
                        key={tab.key}
                        as="button"
                        onClick={() => onTabChange(tab.key)}
                        px={{ base: 4, md: 6, lg: 8 }}
                        py={{ base: 2, md: 3, lg: 4 }}
                        borderRadius="xl"
                        border="1.5px solid"
                        borderColor={isActive ? "#2DC6B8" : "gray.300"}
                        color={isActive ? "#2DC6B8" : "gray.500"}
                        fontWeight={isActive ? "semibold" : "normal"}
                        bg="white"
                        fontSize={{ base: "sm", md: "md", lg: "xl" }}
                        cursor="pointer"
                        style={{ transition: "all 0.2s" }}
                        _hover={{ borderColor: "#2DC6B8", color: "#2DC6B8" }}
                    >
                        {tab.label} ({tab.count})
                    </Box>
                );
            })}
        </Flex>
    );
}