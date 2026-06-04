// src/pages/LoginPage.tsx
import { Image, VStack } from '@chakra-ui/react'
import { SignIn } from '@clerk/clerk-react'
import { WaveLayout } from '../components/layout/WaveLayout'
import CentralEatsLogo from '../assets/CentralEats.png'

export default function LoginPage() {
    return (
        <WaveLayout>
            <VStack gap="0" w="full" mt="-80px">
                <Image
                    src={CentralEatsLogo}
                    alt="CentralEats Logo"
                    boxSize="250px"
                    objectFit="contain"
                />
                <SignIn
                    appearance={{
                        variables: {
                            colorPrimary: '#E65100'
                        }
                    }}
                />
            </VStack>
        </WaveLayout>
    )
}