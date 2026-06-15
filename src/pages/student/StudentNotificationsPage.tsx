import { Flex, Heading, VStack, Box } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { WaveLayout } from '../../components/layout/WaveLayout';
import { AppContainer } from '../../components/layout/AppContainer';
import { NotificationCard } from '../../components/molecules/NotificationCard';
import { EmptyState } from '../../components/organisms/EmptyState';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import { ClearButton } from '../../components/atoms/ClearButton';
import { BackButton } from '../../components/atoms/BackButton';
import { useNotifications } from '../../hooks/useNotifications';
import type { Notification } from '../../hooks/useNotifications';

export default function NotificationsPage() {
    const { notifications, clearAll } = useNotifications();

    return (
        <WaveLayout>
            <Box w="100%" px={4}>
                <AppContainer>
                    <AuthHeader />
                    <Box mb={4}>
                        <BackButton />
                        <Flex justify="space-between" align="center" mb={6} w="full">
                            <Heading size="md" color="#042E63">Notificaciones</Heading>

                            <ClearButton
                                onClick={clearAll}
                                disabled={notifications.length === 0}
                            >
                                Borrar Todo
                            </ClearButton>
                        </Flex>

                        {notifications.length > 0 ? (
                            <VStack align="stretch" gap={4}>
                                {notifications.map((n: Notification) => (
                                    <NotificationCard key={n.id} {...n} />
                                ))}
                            </VStack>
                        ) : (
                            <EmptyState
                                icon={FaCheckCircle}
                                message="¡Felicidades, te encuentras al día!"
                            />
                        )}
                    </Box>
                </AppContainer>
            </Box>
        </WaveLayout>
    );
}