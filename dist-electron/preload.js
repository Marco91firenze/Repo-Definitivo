"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    processCv: (filePath, jobId) => electron_1.ipcRenderer.invoke('process-cv', filePath, jobId),
    validateLicense: () => electron_1.ipcRenderer.invoke('validate-license'),
    syncCredits: () => electron_1.ipcRenderer.invoke('sync-credits'),
    selectFiles: () => electron_1.ipcRenderer.invoke('select-files'),
    saveCredentials: (userId, email) => electron_1.ipcRenderer.invoke('save-credentials', userId, email),
    clearCredentials: () => electron_1.ipcRenderer.invoke('clear-credentials'),
    purchaseCredits: (packageSize) => electron_1.ipcRenderer.invoke('purchase-credits', packageSize),
    canProcessCV: () => electron_1.ipcRenderer.invoke('can-process-cv'),
    deductCredit: () => electron_1.ipcRenderer.invoke('deduct-credit'),
    onCvProcessingProgress: (callback) => {
        electron_1.ipcRenderer.on('cv-processing-progress', (_event, progress) => {
            callback(progress);
        });
    },
});
