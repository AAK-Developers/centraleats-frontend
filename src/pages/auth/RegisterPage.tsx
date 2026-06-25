import { SignUp } from '@clerk/clerk-react';
import { WaveLayout } from '../../components/layout/WaveLayout';
import { AuthHeader } from '../../components/organisms/AuthHeader';
import { AppContainer } from '../../components/layout/AppContainer';

export default function RegisterPage() {
    return (
        <WaveLayout>
            <AppContainer>
                <AuthHeader logoSize="350px">
                    <SignUp
                        forceRedirectUrl="/role-selection"
                        signInForceRedirectUrl="/role-selection"
                        fallbackRedirectUrl="/role-selection"
                        appearance={{
                            variables: {
                                colorPrimary: '#E65100',
                                fontSize: '14px'
                            }
                        }}
                    />
                </AuthHeader>
            </AppContainer>
        </WaveLayout>
    );
}
