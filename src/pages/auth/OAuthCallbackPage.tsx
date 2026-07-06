import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";

/**
 * OAuth callback handler page.
 * Receives the redirect from Clerk OAuth and completes the session.
 * Used by both web (direct URL) and mobile (deep link → route).
 */
export default function OAuthCallbackPage() {
  const { setActive } = useClerk();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search || window.location.hash?.split("?")[1] || ""
    );
    const sessionId = params.get("__clerk_created_session_id");
    const status = params.get("__clerk_status");

    if (status === "complete" && sessionId) {
      setActive({ session: sessionId })
        .then(() => navigate("/", { replace: true }))
        .catch(() => setError("Error al activar la sesión"));
    } else if (status) {
      setError(`Estado de autenticación: ${status}`);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    } else {
      // No params yet — might be loading via deep link
      const timeout = setTimeout(() => {
        if (!sessionId) {
          navigate("/login", { replace: true });
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [setActive, navigate]);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <VStack gap={4}>
          <Text color="red.500">{error}</Text>
          <Text fontSize="sm">Redirigiendo al login...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
      <VStack gap={4}>
        <Spinner size="xl" color="teal.500" />
        <Text>Completando autenticación...</Text>
      </VStack>
    </Box>
  );
}
