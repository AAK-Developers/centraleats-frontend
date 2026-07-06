import { app, BrowserWindow, shell, ipcMain, net } from "electron";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV === "development";

// Remote URL configuration
const REMOTE_URL =
  process.env.CENTRALEATS_URL ||
  "https://centraleatsqa.programacionwebuce.net";
const DEV_URL = "http://localhost:5173";

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
  } catch { }
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
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "CentralEats - Panel de Vendedor",
    icon: join(__dirname, "../resources/icon.png"),
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  // Remove "Electron" from userAgent to prevent HashRouter activation
  mainWindow.webContents.setUserAgent(
    mainWindow.webContents.getUserAgent().replace(/\sElectron\/\S+/, "")
  );

  // Allow Clerk cookies to work without SameSite restrictions
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    if (details.url.includes("clerk") || details.url.includes("accounts.dev")) {
      delete responseHeaders["x-frame-options"];
      delete responseHeaders["X-Frame-Options"];
    }
    callback({ responseHeaders });
  });

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