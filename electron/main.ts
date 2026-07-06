import { app, BrowserWindow, shell, ipcMain, net } from "electron";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV === "development";

// Remote URL configuration
// In dev: loads localhost (Vite dev server)
// In .exe: reads from bundled app-config.json (generated at build time)
const DEV_URL = "http://localhost:5173";
function getRemoteUrl(): string {
  // 1. Environment variable (works in dev/CI)
  if (process.env.CENTRALEATS_URL) {
    return process.env.CENTRALEATS_URL;
  }
  // 2. Bundled config file (written by build scripts, packaged in .exe)
  try {
    const configPath = join(__dirname, "../resources/app-config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (config.remoteUrl) return config.remoteUrl;
  } catch (_error) {
    // Config not found — use fallback
  }
  // 3. Fallback (safe default = QA)
  return "https://centraleatsqa.programacionwebuce.net";
}
const REMOTE_URL = getRemoteUrl();

// Window state persistence
const WINDOW_STATE_FILE = join(app.getPath("userData"), "window-state.json");
interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized: boolean;
}
function loadWindowState(): WindowState {
  try {
    const data = fs.readFileSync(WINDOW_STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { width: 1280, height: 800, isMaximized: false };
  }
}
function saveWindowState(): void {
  if (!mainWindow) return;
  const bounds = mainWindow.getBounds();
  const state: WindowState = {
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    isMaximized: mainWindow.isMaximized(),
  };
  fs.writeFileSync(WINDOW_STATE_FILE, JSON.stringify(state));
}

let mainWindow: BrowserWindow | null = null;

// ══════════════════════════════════════════════════════════
// CRITICAL: Allow third-party cookies for Clerk auth
// Electron 43+ (Chromium 128+) blocks these by default
// ══════════════════════════════════════════════════════════
app.commandLine.appendSwitch(
  "disable-features",
  "ThirdPartyCookieBlocking,SameSiteByDefaultCookies"
);

// --- IPC Handlers ---
ipcMain.on("get-app-version", (event) => {
  event.returnValue = app.getVersion();
});

ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on("window-close", () => mainWindow?.close());

// Cache storage
const CACHE_DIR = join(app.getPath("userData"), "metrics-cache");

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

ipcMain.handle("cache-get", async (_event, key: string): Promise<string | null> => {
  ensureCacheDir();
  const filePath = join(CACHE_DIR, `${key}.json`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
});

ipcMain.handle("cache-set", async (_event, key: string, value: string): Promise<void> => {
  ensureCacheDir();
  const filePath = join(CACHE_DIR, `${key}.json`);
  fs.writeFileSync(filePath, value, "utf-8");
});

ipcMain.handle("cache-clear", async (): Promise<void> => {
  ensureCacheDir();
  const files = fs.readdirSync(CACHE_DIR);
  for (const file of files) {
    fs.unlinkSync(join(CACHE_DIR, file));
  }
});

// Device token
const TOKEN_FILE = join(app.getPath("userData"), ".device-token");

ipcMain.handle("device-token-get", async (): Promise<string | null> => {
  try {
    return fs.readFileSync(TOKEN_FILE, "utf-8").trim();
  } catch {
    return null;
  }
});

ipcMain.handle("device-token-set", async (_event, token: string): Promise<void> => {
  fs.writeFileSync(TOKEN_FILE, token, "utf-8");
});

ipcMain.handle("device-token-clear", async (): Promise<void> => {
  try {
    fs.unlinkSync(TOKEN_FILE);
  } catch (_error) {
    // File does not exist — safe to ignore
  }
});

// --- Network monitoring ---
function setupNetworkMonitoring(): void {
  setInterval(() => {
    const isOnline = net.isOnline();
    mainWindow?.webContents.send("online-status-changed", isOnline);
  }, 5000);
}

// --- Main Window ---
function createWindow(): void {
  const windowState = loadWindowState();
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 900,
    minHeight: 600,
    title: "CentralEats",
    icon: join(__dirname, "../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  // Restore maximized state
  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Remove "Electron" from userAgent to prevent HashRouter activation
  mainWindow.webContents.setUserAgent(
    mainWindow.webContents.getUserAgent().replace(/\sElectron\/\S+/, "")
  );

  // Bypass CORS restrictions in development mode
  // (In production, the app loads from the same origin as the API — no CORS)
  if (isDev) {
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        // Remove the origin header so the server doesn't see localhost
        const requestHeaders = { ...details.requestHeaders };
        delete requestHeaders["Origin"];
        callback({ requestHeaders });
      }
    );
    // Override response headers to allow cross-origin requests
    mainWindow.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        const responseHeaders = { ...details.responseHeaders };
        responseHeaders["access-control-allow-origin"] = ["http://localhost:5173"];
        responseHeaders["access-control-allow-credentials"] = ["true"];
        responseHeaders["access-control-allow-headers"] = [
          "Authorization, Content-Type, X-Requested-With",
        ];
        responseHeaders["access-control-allow-methods"] = [
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        ];
        // Also handle Clerk cookies
        if (
          details.url.includes("clerk") ||
          details.url.includes("accounts.dev")
        ) {
          delete responseHeaders["x-frame-options"];
          delete responseHeaders["X-Frame-Options"];
        }
        callback({ responseHeaders });
      }
    );
  } else {
    // Production: only handle Clerk headers
    mainWindow.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        const responseHeaders = { ...details.responseHeaders };
        if (
          details.url.includes("clerk") ||
          details.url.includes("accounts.dev")
        ) {
          delete responseHeaders["x-frame-options"];
          delete responseHeaders["X-Frame-Options"];
        }
        callback({ responseHeaders });
      }
    );
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    setupNetworkMonitoring();
  });

  // Load base URL
  const targetUrl = isDev ? DEV_URL : REMOTE_URL;
  mainWindow.loadURL(targetUrl);

  // Allow Clerk popups, block everything else
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes("clerk") || url.includes("accounts.dev")) {
      return { action: "allow" };
    }
    if (url.startsWith("http")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  // Open DevTools in development (and temporarily in production for debugging)
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  // F12 to toggle DevTools in dev mode
  if (isDev) {
    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.key === "F12") {
        mainWindow?.webContents.toggleDevTools();
        event.preventDefault();
      }
    });
  }

  mainWindow.on("close", () => {
    saveWindowState();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(createWindow);

  app.on("window-all-closed", () => {
    app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}