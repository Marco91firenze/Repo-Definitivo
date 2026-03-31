import { getSyncStatus, updateSyncStatus, getDatabase } from './database.js';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import * as fs from 'fs';
import { app } from 'electron';
import * as crypto from 'crypto';

interface UserCredentials {
  userId: string;
  email: string;
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Encryption key derived from machine ID (stable per installation)
function getEncryptionKey(): string {
  const keyPath = path.join(app.getPath('userData'), '.key');
  let key = '';
  try {
    if (fs.existsSync(keyPath)) {
      key = fs.readFileSync(keyPath, 'utf-8');
    } else {
      key = crypto.randomBytes(32).toString('hex');
      fs.writeFileSync(keyPath, key, { mode: 0o600 });
    }
  } catch (error) {
    console.error('Failed to manage encryption key:', error);
    key = crypto.randomBytes(32).toString('hex');
  }
  return key;
}

function encryptCredentials(data: object): string {
  const key = Buffer.from(getEncryptionKey(), 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const json = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(json, 'utf-8'),
    cipher.final(),
  ]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptCredentials(encryptedData: string): object | null {
  try {
    const key = Buffer.from(getEncryptionKey(), 'hex');
    const [ivHex, dataHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, 'hex')),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString('utf-8'));
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return null;
  }
}

function getCredentialsPath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, '.credentials');
}

export async function saveUserCredentials(userId: string, email: string) {
  const credPath = getCredentialsPath();
  const credentials = {
    userId,
    email,
    savedAt: new Date().toISOString(),
  };
  const encrypted = encryptCredentials(credentials);
  fs.writeFileSync(credPath, encrypted, { mode: 0o600 });
}

export function loadUserCredentials(): UserCredentials | null {
  try {
    const credPath = getCredentialsPath();
    if (fs.existsSync(credPath)) {
      const encrypted = fs.readFileSync(credPath, 'utf-8');
      return decryptCredentials(encrypted) as UserCredentials;
    }
  } catch (error) {
    console.error('Failed to load credentials:', error);
  }
  return null;
}

export async function validateLicense(): Promise<{
  valid: boolean;
  creditsRemaining: number;
  userId: string;
  email: string;
}> {
  try {
    const credentials = loadUserCredentials();

    if (!credentials) {
      return {
        valid: false,
        creditsRemaining: 0,
        userId: '',
        email: '',
      };
    }

    // Verify with cloud (requires internet)
    const { data: company, error } = await supabase
      .from('companies')
      .select('free_cvs_remaining, id')
      .eq('id', credentials.userId)
      .maybeSingle();

    if (error || !company) {
      // If cloud check fails, use local cache
      const syncStatus = getSyncStatus();
      return {
        valid: syncStatus?.license_valid || false,
        creditsRemaining: syncStatus?.credits_remaining || 0,
        userId: credentials.userId,
        email: credentials.email,
      };
    }

    // Update local cache with cloud data
    updateSyncStatus({
      user_id: credentials.userId,
      credits_remaining: company.free_cvs_remaining,
    });

    return {
      valid: true,
      creditsRemaining: company.free_cvs_remaining,
      userId: credentials.userId,
      email: credentials.email,
    };
  } catch (error) {
    console.error('License validation error:', error);
    // Fallback to local state
    const syncStatus = getSyncStatus();
    return {
      valid: syncStatus?.license_valid || false,
      creditsRemaining: syncStatus?.credits_remaining || 0,
      userId: '',
      email: '',
    };
  }
}

export async function syncCredits(): Promise<{
  success: boolean;
  creditsRemaining: number;
  message: string;
}> {
  try {
    const credentials = loadUserCredentials();

    if (!credentials) {
      return {
        success: false,
        creditsRemaining: 0,
        message: 'Not authenticated',
      };
    }

    // Get latest credit info from cloud
    const { data: company, error } = await supabase
      .from('companies')
      .select('free_cvs_remaining')
      .eq('id', credentials.userId)
      .maybeSingle();

    if (error || !company) {
      return {
        success: false,
        creditsRemaining: getSyncStatus()?.credits_remaining || 0,
        message: 'Failed to sync credits with cloud',
      };
    }

    // Update local database
    updateSyncStatus({
      credits_remaining: company.free_cvs_remaining,
      last_sync: new Date().toISOString(),
    });

    return {
      success: true,
      creditsRemaining: company.free_cvs_remaining,
      message: 'Credits synced successfully',
    };
  } catch (error) {
    console.error('Credit sync error:', error);
    const syncStatus = getSyncStatus();
    return {
      success: false,
      creditsRemaining: syncStatus?.credits_remaining || 0,
      message: String(error),
    };
  }
}

export async function purchaseCredits(
  packageSize: 'batch_100' | 'batch_1000'
): Promise<{
  success: boolean;
  checkoutUrl: string;
}> {
  try {
    const credentials = loadUserCredentials();

    if (!credentials) {
      throw new Error('Not authenticated');
    }

    // Call edge function to create Stripe checkout
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        userId: credentials.userId,
        packageSize,
      },
    });

    if (error) throw error;

    return {
      success: true,
      checkoutUrl: data.url,
    };
  } catch (error) {
    console.error('Purchase error:', error);
    return {
      success: false,
      checkoutUrl: '',
    };
  }
}

export async function canProcessCV(): Promise<{
  allowed: boolean;
  creditsRemaining: number;
  message: string;
}> {
  try {
    const syncStatus = getSyncStatus();

    if (!syncStatus) {
      return {
        allowed: false,
        creditsRemaining: 0,
        message: 'User not authenticated',
      };
    }

    const creditsRemaining = Math.max(0, syncStatus.credits_remaining || 0);

    if (creditsRemaining <= 0) {
      return {
        allowed: false,
        creditsRemaining: 0,
        message: 'No credits remaining. Please purchase more credits to continue.',
      };
    }

    return {
      allowed: true,
      creditsRemaining,
      message: `${creditsRemaining} credits remaining`,
    };
  } catch (error) {
    console.error('Credit check error:', error);
    return {
      allowed: false,
      creditsRemaining: 0,
      message: 'Error checking credits',
    };
  }
}

export async function deductCredit(): Promise<{
  success: boolean;
  creditsRemaining: number;
}> {
  try {
    const syncStatus = getSyncStatus();

    if (!syncStatus) {
      return {
        success: false,
        creditsRemaining: 0,
      };
    }

    const newCredits = Math.max(0, (syncStatus.credits_remaining || 0) - 1);

    updateSyncStatus({
      credits_remaining: newCredits,
      total_cvs_processed: (syncStatus.total_cvs_processed || 0) + 1,
    });

    // Sync deduction to cloud (best effort, don't fail if offline)
    try {
      const credentials = loadUserCredentials();
      if (credentials) {
        await supabase
          .from('companies')
          .update({ free_cvs_remaining: newCredits })
          .eq('id', credentials.userId);
      }
    } catch {
      // Offline - will sync later
    }

    return {
      success: true,
      creditsRemaining: newCredits,
    };
  } catch (error) {
    console.error('Deduction error:', error);
    return {
      success: false,
      creditsRemaining: getSyncStatus()?.credits_remaining || 0,
    };
  }
}

export async function clearCredentials() {
  try {
    const credPath = getCredentialsPath();
    if (fs.existsSync(credPath)) {
      fs.unlinkSync(credPath);
    }
  } catch (error) {
    console.error('Failed to clear credentials:', error);
  }
}
