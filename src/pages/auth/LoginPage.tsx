import { SignIn } from '@clerk/clerk-react'
import { WaveLayout } from '../../components/layout/WaveLayout'
import { AuthHeader } from '../../components/organisms/AuthHeader'
import { AppContainer } from '../../components/layout/AppContainer'

export default function LoginPage() {
    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoSize="350px" >
                    <SignIn forceRedirectUrl="/role-selection"
                        appearance={{
                            variables: {
                                colorPrimary: '#E65100',
                                fontSize: '14px'
                            }
                        }} />
                </AuthHeader>
            </AppContainer>
        </WaveLayout>
    )
}