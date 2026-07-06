import { useState } from "react";
import { SignIn, useSignIn, useClerk } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { isCapacitorNative, openOAuthBrowser, closeOAuthBrowser, onOAuthCallback } from "../../mobile";
import { WaveLayout } from '../../components/layout/WaveLayout'

import { AppContainer } from '../../components/layout/AppContainer'
import { AuthHeader } from '../../components/shared/organisms/AuthHeader'

export default function LoginPage() {
    // --- Capacitor Native OAuth Flow ---
    const [nativeLoading, setNativeLoading] = useState(false);
    const { signIn } = useSignIn();
    const { setActive } = useClerk();
    const navigate = useNavigate();
  
    const handleNativeLogin = async () => {
      if (!signIn) return;
      setNativeLoading(true);
      try {
        const result = await signIn.create({
          strategy: "oauth_google",
          redirectUrl: "https://centraleatsqa.programacionwebuce.net/oauth-callback",
        });
        const authUrl =
          result.firstFactorVerification?.externalVerificationRedirectURL?.toString();
        if (authUrl) {
          const cleanup = onOAuthCallback(async (callbackResult) => {
            cleanup();
            await closeOAuthBrowser();
            if (callbackResult.status === "complete" && callbackResult.createdSessionId) {
              await setActive({ session: callbackResult.createdSessionId });
              navigate("/role-selection", { replace: true });
            } else {
              setNativeLoading(false);
            }
          });
          await openOAuthBrowser(authUrl);
        }
      } catch (err: any) {
        console.error("Native OAuth error:", err);
        setNativeLoading(false);
        const errMsg = err?.message || err?.toString() || "";
        if (err?.errors?.[0]?.code === "session_exists" || errMsg.includes("already signed in")) {
          navigate("/role-selection", { replace: true });
        }
      }
    };
  
    // If running in Capacitor, show native login UI
    if (isCapacitorNative()) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="100vh" p={4} bg="gray.50">
          <VStack gap={6} w="full" maxW="sm" textAlign="center">
            <img src="/CentralEatsLogo.png" alt="CentralEats" style={{ width: "120px", height: "120px" }} />
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Iniciar Sesión
            </Text>
            <Text fontSize="sm" color="gray.500">
              Usa tu cuenta de Google para continuar
            </Text>
            <Button
              w="full"
              colorScheme="teal"
              size="lg"
              onClick={handleNativeLogin}
              loading={nativeLoading}
              loadingText="Conectando..."
            >
              Continuar con Google
            </Button>
          </VStack>
        </Box>
      );
    }
    // --- End Capacitor Native OAuth Flow ---

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