import { Flex, Box } from '@chakra-ui/react'

export const WaveLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Flex minH="100vh" bg="white" direction="column" overflow="hidden">

            <Box w="full" transform="rotate(180deg)" h="120px">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
                    <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#042E63' }}></path>
                </svg>
            </Box>

            <Flex flex="1" direction="column" align="center" pt="2">
                {children}
            </Flex>

            <Box w="full" h="120px">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
                    <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#042E63' }}></path>
                </svg>
            </Box>
        </Flex>
    )
}