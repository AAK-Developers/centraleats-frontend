import { SignIn } from '@clerk/clerk-react'
import { WaveLayout } from '../../components/layout/WaveLayout'

import { AppContainer } from '../../components/layout/AppContainer'
import { AuthHeader } from '../../components/shared/organisms/AuthHeader'

export default function LoginPage() {
    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoSize="350px" >
                    <SignIn
                        forceRedirectUrl="/role-selection"
                        signUpForceRedirectUrl="/role-selection"
                        fallbackRedirectUrl="/role-selection"
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