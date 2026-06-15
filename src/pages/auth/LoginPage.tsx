import { SignIn } from '@clerk/clerk-react'
import { WaveLayout } from '../../components/layout/WaveLayout'
import { AuthHeader } from '../../components/organisms/AuthHeader'

export default function LoginPage() {
    return (
        <WaveLayout>
            <AuthHeader logoSize="250px" >
                <SignIn forceRedirectUrl="/role-selection"
                    appearance={{
                        variables: {
                            colorPrimary: '#E65100'
                        }
                    }} />
            </AuthHeader>
        </WaveLayout>
    )
}