import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  processCv: (filePath: string, jobId: string) =>
    ipcRenderer.invoke('process-cv', filePath, jobId),
  validateLicense: () =>
    ipcRenderer.invoke('validate-license'),
  syncCredits: () =>
    ipcRenderer.invoke('sync-credits'),
  selectFiles: () =>
    ipcRenderer.invoke('select-files'),
  saveCredentials: (userId: string, email: string) =>
    ipcRenderer.invoke('save-credentials', userId, email),
  clearCredentials: () =>
    ipcRenderer.invoke('clear-credentials'),
  purchaseCredits: (packageSize: 'batch_100' | 'batch_1000') =>
    ipcRenderer.invoke('purchase-credits', packageSize),
  canProcessCV: () =>
    ipcRenderer.invoke('can-process-cv'),
  deductCredit: () =>
    ipcRenderer.invoke('deduct-credit'),
  onCvProcessingProgress: (callback: (progress: number) => void) => {
    ipcRenderer.on('cv-processing-progress', (_event, progress) => {
      callback(progress);
    });
  },
});
