import { Spinner } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { WaveLayout } from '../../components/layout/WaveLayout'
import { AuthHeader } from '../../components/organisms/AuthHeader'


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
        <WaveLayout>
            <AuthHeader logoSize="400px">
                <Spinner color="primaryCyan" boxSize="20" />
            </AuthHeader>
        </WaveLayout>
    )
}