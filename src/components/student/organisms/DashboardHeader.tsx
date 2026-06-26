import { useState } from 'react';
import { Flex, HStack, Text, Button, IconButton, Image, Box } from "@chakra-ui/react";
import { FaBell, FaShoppingCart, FaUser } from "react-icons/fa";
import CentralEats from "../../../assets/CentralEats.png";


import { useNotifications } from '../../../hooks/useNotifications';
import { CartPanel } from '../../cart/organisms/CartPanel';
import { useCartStore } from '../../../store/cartStore';
import { NotificationPanel } from '../../shared/organisms/NotificationPanel';
import { ProfilePanel } from '../../shared/organisms/ProfilePanel';



type DashboardHeaderProps = {
    userName: string;
};

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { notifications, clearAll } = useNotifications();
    const totalItems = useCartStore((s) => s.totalItems());

    return (
        <>
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" mb={8} mt={-50} wrap="wrap" gap={4} px={4}>
                <Image
                    src={CentralEats}
                    alt="Logo"
                    w={{ base: "225px", md: "250px" }}
                />

                <HStack justify="center" wrap="wrap" gap={4}>
                    {/* Notifications Bell */}
                    <Box position="relative">
                        <IconButton
                            aria-label="Notificaciones"
                            borderRadius="full"
                            size={{ base: "lg", md: "2xl" }}
                            bg="#30B2BC"
                            color="white"
                            _hover={{ bg: "#2899a1" }}
                            onClick={() => setIsNotificationOpen(true)}
                        >
                            <FaBell size="24px" />
                        </IconButton>
                        {notifications.length > 0 && (
                            <Box
                                position="absolute"
                                top="-2px"
                                right="-2px"
                                bg="red.500"
                                color="white"
                                borderRadius="full"
                                minW="20px"
                                h="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="10px"
                                fontWeight="bold"
                                border="2px solid white"
                                zIndex={1}
                            >
                                {notifications.length > 9 ? "9+" : notifications.length}
                            </Box>
                        )}
                    </Box>

                    {/* Cart Button with item count badge */}
                    <Box position="relative">
                        <IconButton
                            aria-label="Carrito"
                            borderRadius="full"
                            size={{ base: "lg", md: "2xl" }}
                            bg="#30B2BC"
                            color="white"
                            _hover={{ bg: "#2899a1" }}
                            onClick={() => setIsCartOpen(true)}
                        >
                            <FaShoppingCart size="24px" />
                        </IconButton>
                        {totalItems > 0 && (
                            <Box
                                position="absolute"
                                top="-2px"
                                right="-2px"
                                bg="#042E63"
                                color="white"
                                borderRadius="full"
                                minW="20px"
                                h="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="10px"
                                fontWeight="bold"
                                border="2px solid white"
                                zIndex={1}
                            >
                                {totalItems > 9 ? "9+" : totalItems}
                            </Box>
                        )}
                    </Box>

                    <Button
                        borderRadius="full"
                        colorPalette="orange"
                        px={{ base: 4, md: 6 }}
                        size={{ base: "lg", md: "2xl" }}
                        onClick={() => setIsProfileOpen(true)}
                    >
                        <HStack gap={3}>
                            <FaUser size="20px" />
                            <Text fontSize={{ base: "xs", md: "lg" }} fontWeight="semibold">
                                Hola, {userName}
                            </Text>
                        </HStack>
                    </Button>
                </HStack>
            </Flex>

            <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                onClearAll={clearAll}
            />

            <ProfilePanel
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />

            <CartPanel
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </>
    );
};
