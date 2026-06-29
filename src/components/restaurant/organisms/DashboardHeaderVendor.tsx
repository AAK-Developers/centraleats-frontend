import { useState } from 'react';
import { Flex, HStack, Text, Button, IconButton, Image, Box } from "@chakra-ui/react";
import { FaBell, FaUser } from "react-icons/fa";
import CentralEats from "../../../assets/CentralEats.png";

import { ProfilePanelVendor } from './ProfilePanelVendor';
import { useNotifications } from '../../../hooks/useNotifications';
import { NotificationPanel } from '../../shared/organisms/NotificationPanel';

type DashboardHeaderVendorProps = {
    userName: string;
    restaurantId?: string;
};

export const DashboardHeaderVendor = ({
    userName,
    restaurantId,
}: DashboardHeaderVendorProps) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { notifications, clearAll } = useNotifications({ role: 'vendor', vendorId: restaurantId });

    return (
        <>
            <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="center"
                mb={{ base: 4, md: 6, lg: 8 }}
                mt={{ base: -6, md: -10, lg: -50 }}
                wrap="wrap"
                gap={{ base: 2, md: 4 }}
                px={{ base: 2, md: 4 }}
            >
                <Image
                    src={CentralEats}
                    alt="Logo"
                    w={{ base: "160px", md: "200px", lg: "250px" }}
                />

                <HStack
                    justify="center"
                    wrap="wrap"
                    gap={{ base: 2, md: 4 }}
                >
                    <Box position="relative">
                        <IconButton
                            aria-label="Notificaciones"
                            borderRadius="full"
                            size={{ base: "md", md: "lg", lg: "2xl" }}
                            bg="#30B2BC"
                            color="white"
                            _hover={{ bg: "#2899a1" }}
                            onClick={() => setIsNotificationOpen(true)}
                        >
                            <FaBell size="20px" />
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

                    <Button
                        borderRadius="full"
                        colorPalette="orange"
                        px={{ base: 3, md: 4, lg: 6 }}
                        size={{ base: "md", md: "lg", lg: "2xl" }}
                        onClick={() => setIsProfileOpen(true)}
                    >
                        <HStack gap={{ base: 2, md: 3 }}>
                            <FaUser size="16px" />
                            <Text
                                fontSize={{ base: "xs", md: "sm", lg: "lg" }}
                                fontWeight="semibold"
                            >
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
            <ProfilePanelVendor
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                restaurantId={restaurantId}
            />
        </>
    );
};
