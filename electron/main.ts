import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { initializeDatabase } from './services/database.js';
import { processCVFile } from './services/cvProcessor.js';
import { validateLicense, syncCredits, saveUserCredentials, clearCredentials, purchaseCredits, canProcessCV, deductCredit } from './services/licenseManager.js';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  await initializeDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('process-cv', async (_event, filePath: string, jobId: string) => {
  try {
    const result = await processCVFile(filePath, jobId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('validate-license', async () => {
  try {
    const result = await validateLicense();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('sync-credits', async () => {
  try {
    const result = await syncCredits();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('select-files', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'PDFs', extensions: ['pdf'] },
      { name: 'Word Documents', extensions: ['docx', 'doc'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });
  return result.filePaths;
});

ipcMain.handle('save-credentials', async (_event, userId: string, email: string) => {
  try {
    await saveUserCredentials(userId, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('clear-credentials', async () => {
  try {
    await clearCredentials();
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('purchase-credits', async (_event, packageSize: 'batch_100' | 'batch_1000') => {
  try {
    const result = await purchaseCredits(packageSize);
    return { success: result.success, checkoutUrl: result.checkoutUrl };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('can-process-cv', async () => {
  try {
    const result = await canProcessCV();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('deduct-credit', async () => {
  try {
    const result = await deductCredit();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});
