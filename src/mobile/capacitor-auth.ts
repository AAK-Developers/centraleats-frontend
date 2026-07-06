/**
 * Capacitor-specific authentication utilities.
 * This module is ONLY used when running inside Capacitor (Android/iOS).
 * Web and Electron use standard Clerk <SignIn> component.
 */
import { Browser } from "@capacitor/browser";
import { App as CapApp } from "@capacitor/app";

export interface OAuthCallbackResult {
  status: string;
  createdSessionId?: string;
  rotatingToken?: string;
}

/**
 * Check if running inside Capacitor native platform
 */
export function isCapacitorNative(): boolean {
  return (
    typeof window !== "undefined" &&
    !!(window as any).Capacitor &&
    (window as any).Capacitor.isNativePlatform &&
    (window as any).Capacitor.isNativePlatform()
  );
}

/**
 * Open OAuth URL in system browser (for Capacitor only)
 */
export async function openOAuthBrowser(url: string): Promise<void> {
  await Browser.open({ url, windowName: "_self" });
}

/**
 * Close the in-app browser after OAuth completes
 */
export async function closeOAuthBrowser(): Promise<void> {
  try {
    await Browser.close();
  } catch {
    // Browser may already be closed
  }
}

/**
 * Listen for deep link callback from OAuth
 * Returns a cleanup function to remove the listener
 */
export function onOAuthCallback(
  callback: (result: OAuthCallbackResult) => void
): () => void {
  const listener = CapApp.addListener("appUrlOpen", (event) => {
    if (event.url.includes("oauth-callback")) {
      try {
        const url = new URL(event.url);
        const params = new URLSearchParams(url.search || url.hash?.split("?")[1] || "");
        const result: OAuthCallbackResult = {
          status: params.get("__clerk_status") || params.get("status") || "unknown",
          createdSessionId: params.get("__clerk_created_session_id") || undefined,
          rotatingToken: params.get("rotating_token_nonce") || undefined,
        };
        callback(result);
      } catch {
        callback({ status: "error" });
      }
    }
  });

  return () => {
    listener.then((l) => l.remove());
  };
}
