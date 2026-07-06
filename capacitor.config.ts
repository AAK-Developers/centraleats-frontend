import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ec.net.programacionwebuce.centraleats",
  appName: "CentralEats",
  webDir: "dist",
  server: {
    // Use virtual hostname to enable cookies and avoid CORS issues
    hostname: "centraleatsqa.programacionwebuce.net",
    androidScheme: "https",
    // Allow navigation to auth and API domains
    allowNavigation: [
      "centraleatsqa.programacionwebuce.net",
      "centraleatsprod.programacionwebuce.net",
      "*.clerk.accounts.dev",
      "accounts.google.com",
      "*.google.com",
    ],
  },
  plugins: {
    App: {
      // Deep link configuration for OAuth callback
      url: "https://centraleatsqa.programacionwebuce.net",
    },
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
