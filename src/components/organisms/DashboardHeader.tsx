import { useState } from 'react';
import { Flex, HStack, Text, Button, IconButton, Image } from "@chakra-ui/react";
import { FaBell, FaShoppingCart, FaUser } from "react-icons/fa";
import CentralEats from "../../assets/CentralEats.png";

import { NotificationPanel } from '../organisms/NotificationPanel';
import { ProfilePanel } from '../organisms/ProfilePanel';
import { useNotifications } from '../../hooks/useNotifications';

type DashboardHeaderProps = {
    userName: string;
    onCartClick?: () => void;
};

export const DashboardHeader = ({
    userName,
    onCartClick,
}: DashboardHeaderProps) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { notifications, clearAll } = useNotifications();

    return (
        <>
            <Flex justify="space-between" align="center" mb={8} mt={4}>
                <Image
                    src={CentralEats}
                    alt="Logo"
                    w="250px"
                />

                <HStack gap={4}>
                    <IconButton
                        aria-label="Notificaciones"
                        borderRadius="full"
                        size="2xl"
                        bg="#30B2BC"
                        color="white"
                        _hover={{ bg: "#2899a1" }}
                        onClick={() => setIsNotificationOpen(true)}
                    >
                        <FaBell size="24px" />
                    </IconButton>

                    <IconButton
                        aria-label="Carrito"
                        borderRadius="full"
                        size="2xl"
                        bg="#30B2BC"
                        color="white"
                        _hover={{ bg: "#2899a1" }}
                        onClick={onCartClick}
                    >
                        <FaShoppingCart size="24px" />
                    </IconButton>

                    <Button
                        borderRadius="full"
                        colorPalette="orange"
                        px={6}
                        size="2xl"
                        onClick={() => setIsProfileOpen(true)}
                    >
                        <HStack gap={3}>
                            <FaUser size="20px" />
                            <Text fontSize="lg" fontWeight="semibold">
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
        </>
    );
};