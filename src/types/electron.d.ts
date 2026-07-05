/**
 * Type declarations for the Electron bridge API.
 * These are exposed via contextBridge in electron/preload.ts.
 * Available only when running inside Electron desktop app.
 */

interface ElectronCacheAPI {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  clear(): Promise<void>;
}

interface ElectronDeviceTokenAPI {
  get(): Promise<string | null>;
  set(token: string): Promise<void>;
  clear(): Promise<void>;
}

interface ElectronAPI {
  platform: NodeJS.Platform;
  isElectron: true;
  getVersion(): string;
  minimize(): void;
  maximize(): void;
  close(): void;
  cache: ElectronCacheAPI;
  deviceToken: ElectronDeviceTokenAPI;
  onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
