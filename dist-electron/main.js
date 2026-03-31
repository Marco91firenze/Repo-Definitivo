"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const database_js_1 = require("./services/database.js");
const cvProcessor_js_1 = require("./services/cvProcessor.js");
const licenseManager_js_1 = require("./services/licenseManager.js");
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    const startUrl = electron_is_dev_1.default
        ? 'http://localhost:5173'
        : `file://${path_1.default.join(__dirname, '../dist/index.html')}`;
    mainWindow.loadURL(startUrl);
    if (electron_is_dev_1.default) {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
electron_1.app.on('ready', async () => {
    await (0, database_js_1.initializeDatabase)();
    createWindow();
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// IPC Handlers
electron_1.ipcMain.handle('process-cv', async (_event, filePath, jobId) => {
    try {
        const result = await (0, cvProcessor_js_1.processCVFile)(filePath, jobId);
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('validate-license', async () => {
    try {
        const result = await (0, licenseManager_js_1.validateLicense)();
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('sync-credits', async () => {
    try {
        const result = await (0, licenseManager_js_1.syncCredits)();
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('select-files', async () => {
    if (!mainWindow)
        return null;
    const result = await electron_1.dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'PDFs', extensions: ['pdf'] },
            { name: 'Word Documents', extensions: ['docx', 'doc'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    });
    return result.filePaths;
});
electron_1.ipcMain.handle('save-credentials', async (_event, userId, email) => {
    try {
        await (0, licenseManager_js_1.saveUserCredentials)(userId, email);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('clear-credentials', async () => {
    try {
        await (0, licenseManager_js_1.clearCredentials)();
        return { success: true };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('purchase-credits', async (_event, packageSize) => {
    try {
        const result = await (0, licenseManager_js_1.purchaseCredits)(packageSize);
        return { success: result.success, checkoutUrl: result.checkoutUrl };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('can-process-cv', async () => {
    try {
        const result = await (0, licenseManager_js_1.canProcessCV)();
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
electron_1.ipcMain.handle('deduct-credit', async () => {
    try {
        const result = await (0, licenseManager_js_1.deductCredit)();
        return { success: true, data: result };
    }
    catch (error) {
        return { success: false, error: String(error) };
    }
});
