import { contextBridge, ipcRenderer } from "electron";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Secure bridge API exposed to the renderer process.
 * Only exposes what's strictly necessary — no direct Node.js access.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  // Platform detection
  platform: process.platform,
  isElectron: true,

  // App info
  getVersion: (): string => {
    return ipcRenderer.sendSync("get-app-version") as string;
  },

  // Window controls
  minimize: (): void => {
    ipcRenderer.send("window-minimize");
  },
  maximize: (): void => {
    ipcRenderer.send("window-maximize");
  },
  close: (): void => {
    ipcRenderer.send("window-close");
  },

  // Offline cache (for Phase 2.3)
  cache: {
    get: (key: string): Promise<string | null> => {
      return ipcRenderer.invoke("cache-get", key);
    },
    set: (key: string, value: string): Promise<void> => {
      return ipcRenderer.invoke("cache-set", key, value);
    },
    clear: (): Promise<void> => {
      return ipcRenderer.invoke("cache-clear");
    },
  },

  // Device token (for Phase 2.4)
  deviceToken: {
    get: (): Promise<string | null> => {
      return ipcRenderer.invoke("device-token-get");
    },
    set: (token: string): Promise<void> => {
      return ipcRenderer.invoke("device-token-set", token);
    },
    clear: (): Promise<void> => {
      return ipcRenderer.invoke("device-token-clear");
    },
  },

  // Network status
  onOnlineStatusChange: (
    callback: (isOnline: boolean) => void
  ): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: boolean) =>
      callback(status);
    ipcRenderer.on("online-status-changed", handler);
    return () => {
      ipcRenderer.removeListener("online-status-changed", handler);
    };
  },
});
