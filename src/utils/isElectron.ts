/// <reference path="../types/electron.d.ts" />
/**
 * Detect if the app is running inside Electron.
 * Uses the bridge API exposed by preload.ts.
 */
export function isElectron(): boolean {
  return window.electronAPI?.isElectron === true;
}

/**
 * Get the Electron API if available.
 * Returns undefined when running in browser.
 */
export function getElectronAPI(): ElectronAPI | undefined {
  return window.electronAPI;
}
