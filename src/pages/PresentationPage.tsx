import { Flex, VStack, Spinner, Box, Image } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CentralEatsLogo from '../assets/CentralEats.png'
import { useUser } from '@clerk/clerk-react'


export default function PresentationPage() {
    const navigate = useNavigate()
    const { isLoaded, isSignedIn } = useUser()

    useEffect(() => {
        if (!isLoaded) return

        const timer = setTimeout(() => {
            if (isSignedIn) {
                navigate('/role-selection')
            } else {
                navigate('/login')
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [isLoaded, isSignedIn, navigate])

    return (
        <Flex minH="100vh" bg="white" direction="column" justify="space-between" overflow="hidden">

            <Box w="full" transform="rotate(180deg)" h="150px">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
                    <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#042E63' }}></path>
                </svg>
            </Box>

            <VStack gap="8" flex="1" justify="center" mt="-80px">
                <Image
                    src={CentralEatsLogo}
                    alt="CentralEats Logo"
                    boxSize="400px"
                    objectFit="contain"
                />
                <Spinner color="primaryCyan" boxSize="20" />
            </VStack>

            <Box w="full" h="150px">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ height: '100%', width: '100%' }}>
                    <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z" style={{ stroke: 'none', fill: '#042E63' }}></path>
                </svg>
            </Box>
        </Flex>
    )
}