import { app, BrowserWindow, shell, ipcMain, net } from "electron";
import path from "path";
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

// --- IPC Handlers ---

// App version
ipcMain.on("get-app-version", (event) => {
  event.returnValue = app.getVersion();
});

// Window controls
ipcMain.on("window-minimize", () => mainWindow?.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on("window-close", () => mainWindow?.close());

// Cache storage (simple file-based)
const CACHE_DIR = join(app.getPath("userData"), "metrics-cache");

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

ipcMain.handle(
  "cache-get",
  async (_event, key: string): Promise<string | null> => {
    ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch {
      return null;
    }
  }
);

ipcMain.handle(
  "cache-set",
  async (_event, key: string, value: string): Promise<void> => {
    ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key}.json`);
    fs.writeFileSync(filePath, value, "utf-8");
  }
);

ipcMain.handle("cache-clear", async (): Promise<void> => {
  ensureCacheDir();
  const files = fs.readdirSync(CACHE_DIR);
  for (const file of files) {
    fs.unlinkSync(join(CACHE_DIR, file));
  }
});

// Device token storage (secure file in userData)
const TOKEN_FILE = join(app.getPath("userData"), ".device-token");

ipcMain.handle("device-token-get", async (): Promise<string | null> => {
  try {
    return fs.readFileSync(TOKEN_FILE, "utf-8").trim();
  } catch {
    return null;
  }
});

ipcMain.handle(
  "device-token-set",
  async (_event, token: string): Promise<void> => {
    fs.writeFileSync(TOKEN_FILE, token, "utf-8");
  }
);

ipcMain.handle("device-token-clear", async (): Promise<void> => {
  try {
    fs.unlinkSync(TOKEN_FILE);
  } catch {
    // File doesn't exist, ignore
  }
});

// --- Network monitoring ---
function setupNetworkMonitoring(): void {
  // The setupNetworkMonitoring function will use the imported net module
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
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    autoHideMenuBar: true,
    show: false,
  });

  // Show window when ready to avoid white flash
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    setupNetworkMonitoring();
  });

  // Load URL based on environment
  const targetUrl = isDev ? DEV_URL : REMOTE_URL;
  const metricsPath = "/vendor-dashboard/metrics";
  mainWindow.loadURL(`${targetUrl}${metricsPath}`);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Prevent multiple instances
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
