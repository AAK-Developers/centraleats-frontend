import { Box, VStack, Heading, Flex, } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

import { NotificationCard } from "../molecules/NotificationCard";
import { EmptyState } from "../organisms/EmptyState";
import { ClearButton } from "../atoms/ClearButton";

import type { Notification } from "../../hooks/useNotifications";
import { CloseButton } from "../atoms/CloseButton";

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onClearAll: () => void;
}

export const NotificationPanel = ({
    isOpen,
    onClose,
    notifications,
    onClearAll,
}: NotificationPanelProps) => {
    if (!isOpen) return null;

    return (
        <>
            <Box
                position="fixed"
                inset={0}
                bg="blackAlpha.400"
                backdropFilter="blur(2px)"
                zIndex={998}
                onClick={onClose}
            />
            <Box
                position="fixed"
                top={{ base: "60px", md: "60px" }}
                bottom={{ base: "60px", md: "60px" }}
                right={{ base: "4px", md: "24px" }}
                w={{ base: "calc(100% - 8px)", md: "400px" }}
                bg="white"
                borderRadius="3xl"
                boxShadow="2xl"
                overflow="hidden"
                zIndex={999}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    p={6}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                >
                    <Heading
                        size="md"
                        color="#042E63"
                    >
                        Notificaciones
                    </Heading>

                    <Flex align="center" gap={3}>
                        <ClearButton
                            onClick={onClearAll}
                            disabled={notifications.length === 0}
                        >
                            Borrar Todo
                        </ClearButton>

                        <CloseButton onClick={onClose} />
                    </Flex>
                </Flex>

                <Box
                    p={5}
                    overflowY="auto"
                    h="calc(100% - 88px)"
                >
                    {notifications.length > 0 ? (
                        <VStack
                            align="stretch"
                            gap={4}
                        >
                            {notifications.map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    {...notification}
                                />
                            ))}
                        </VStack>
                    ) : (
                        <EmptyState
                            icon={FaCheckCircle}
                            message="¡Felicidades, te encuentras al día!"
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};