import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { FaClipboardList, FaFire, FaBell, FaUtensils } from "react-icons/fa";
import type { IconType } from "react-icons";

export type OrderTab = "nuevos" | "en_cocina" | "listos" | "platos";

interface Tab {
    key: OrderTab;
    label: string;
    count: number;
    badgeColor?: string;
}

interface Props {
    tabs: Tab[];
    activeTab: OrderTab;
    onTabChange: (tab: OrderTab) => void;
}

const TAB_ICONS: Record<OrderTab, IconType> = {
    nuevos: FaClipboardList,
    en_cocina: FaFire,
    listos: FaBell,
    platos: FaUtensils,
};

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
                const hasItems = tab.count > 0 && tab.badgeColor;
                const TabIcon = TAB_ICONS[tab.key];

                return (
                    <Box
                        key={tab.key}
                        as="button"
                        onClick={() => onTabChange(tab.key)}
                        px={{ base: 4, md: 6, lg: 7 }}
                        py={{ base: 2, md: 3, lg: 3.5 }}
                        borderRadius="full"
                        border="1.5px solid"
                        borderColor={isActive ? "#2DC6B8" : "gray.200"}
                        color={isActive ? "white" : "gray.500"}
                        fontWeight={isActive ? "bold" : "medium"}
                        bg={isActive ? "linear-gradient(135deg, #2DC6B8 0%, #25a89c 100%)" : "white"}
                        boxShadow={isActive ? "0 4px 14px rgba(45,198,184,0.35)" : "none"}
                        fontSize={{ base: "md", md: "lg", lg: "xl" }}
                        cursor="pointer"
                        transition="all 0.2s ease"
                        _hover={
                            isActive
                                ? { transform: "translateY(-1px)" }
                                : { borderColor: "#2DC6B8", color: "#2DC6B8", bg: "#F0FBFC" }
                        }
                        position="relative"
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Icon as={TabIcon} boxSize={{ base: 3.5, md: 4 }} />
                        <Text>{tab.label}</Text>
                        {tab.count > 0 && (
                            <Box
                                as="span"
                                bg={isActive ? "white" : hasItems ? tab.badgeColor : "gray.200"}
                                color={isActive ? "#2DC6B8" : "white"}
                                borderRadius="full"
                                minW="22px"
                                h="22px"
                                display="inline-flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="11px"
                                fontWeight="bold"
                                px={1}
                            >
                                {tab.count}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </Flex>
    );
}
