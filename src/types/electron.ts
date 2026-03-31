export interface ElectronAPI {
  processCv: (filePath: string, jobId: string) => Promise<{
    success: boolean;
    data?: { id: string; fit_score: number; filename: string };
    error?: string;
  }>;
  validateLicense: () => Promise<{
    success: boolean;
    data?: { valid: boolean; creditsRemaining: number; userId: string; email: string };
    error?: string;
  }>;
  syncCredits: () => Promise<{
    success: boolean;
    data?: { creditsRemaining: number; message: string };
    error?: string;
  }>;
  selectFiles: () => Promise<string[]>;
  saveCredentials: (userId: string, email: string) => Promise<{ success: boolean }>;
  clearCredentials: () => Promise<{ success: boolean }>;
  purchaseCredits: (packageSize: 'batch_100' | 'batch_1000') => Promise<{
    success: boolean;
    checkoutUrl?: string;
    error?: string;
  }>;
  canProcessCV: () => Promise<{
    success: boolean;
    data?: { allowed: boolean; creditsRemaining: number; message: string };
    error?: string;
  }>;
  deductCredit: () => Promise<{
    success: boolean;
    data?: { success: boolean; creditsRemaining: number };
    error?: string;
  }>;
  onCvProcessingProgress: (callback: (progress: number) => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
