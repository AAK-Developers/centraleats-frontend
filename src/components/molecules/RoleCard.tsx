import { VStack, Box, Flex } from '@chakra-ui/react';
import { ActionButton } from '../atoms/ActionButton';
import { SubtitleTag } from '../atoms/SubtitleTag';
import { CardText } from '../atoms/CardText';

interface RoleCardProps {
    bgImage: string;
    subtitle: string;
    title: string;
    description: string;
    onClick: () => void;
    isLoading: boolean;
}

export const RoleCard = ({ bgImage, subtitle, title, description, onClick, isLoading }: RoleCardProps) => {
    return (
        <Box
            w="full" h="400px" borderRadius="2xl" overflow="hidden" position="relative"
            bgImage={`url(${bgImage})`} bgSize="cover" backgroundPosition="center"
        >
            <Box position="absolute" inset="0" bg="blackAlpha.600" />

            <Flex position="relative" zIndex={1} h="full" direction="column" justify="space-between" p="8">

                <Box alignSelf="flex-start" mt={-8}>
                    <SubtitleTag>{subtitle}</SubtitleTag>
                </Box>

                <VStack align="flex-start" gap={2}>
                    <CardText variant="description">{description}</CardText>
                    <CardText variant="title">{title}</CardText>

                    <ActionButton label="Iniciar" onClick={onClick} isLoading={isLoading} />
                </VStack>
            </Flex>
        </Box>
    );
};