"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveUserCredentials = saveUserCredentials;
exports.loadUserCredentials = loadUserCredentials;
exports.validateLicense = validateLicense;
exports.syncCredits = syncCredits;
exports.purchaseCredits = purchaseCredits;
exports.canProcessCV = canProcessCV;
exports.deductCredit = deductCredit;
exports.clearCredentials = clearCredentials;
const database_js_1 = require("./database.js");
const supabase_js_1 = require("@supabase/supabase-js");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const electron_1 = require("electron");
const crypto = __importStar(require("crypto"));
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// Encryption key derived from machine ID (stable per installation)
function getEncryptionKey() {
    const keyPath = path_1.default.join(electron_1.app.getPath('userData'), '.key');
    let key = '';
    try {
        if (fs.existsSync(keyPath)) {
            key = fs.readFileSync(keyPath, 'utf-8');
        }
        else {
            key = crypto.randomBytes(32).toString('hex');
            fs.writeFileSync(keyPath, key, { mode: 0o600 });
        }
    }
    catch (error) {
        console.error('Failed to manage encryption key:', error);
        key = crypto.randomBytes(32).toString('hex');
    }
    return key;
}
function encryptCredentials(data) {
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
function decryptCredentials(encryptedData) {
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
    }
    catch (error) {
        console.error('Failed to decrypt credentials:', error);
        return null;
    }
}
function getCredentialsPath() {
    const userDataPath = electron_1.app.getPath('userData');
    return path_1.default.join(userDataPath, '.credentials');
}
async function saveUserCredentials(userId, email) {
    const credPath = getCredentialsPath();
    const credentials = {
        userId,
        email,
        savedAt: new Date().toISOString(),
    };
    const encrypted = encryptCredentials(credentials);
    fs.writeFileSync(credPath, encrypted, { mode: 0o600 });
}
function loadUserCredentials() {
    try {
        const credPath = getCredentialsPath();
        if (fs.existsSync(credPath)) {
            const encrypted = fs.readFileSync(credPath, 'utf-8');
            return decryptCredentials(encrypted);
        }
    }
    catch (error) {
        console.error('Failed to load credentials:', error);
    }
    return null;
}
async function validateLicense() {
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
            const syncStatus = (0, database_js_1.getSyncStatus)();
            return {
                valid: syncStatus?.license_valid || false,
                creditsRemaining: syncStatus?.credits_remaining || 0,
                userId: credentials.userId,
                email: credentials.email,
            };
        }
        // Update local cache with cloud data
        (0, database_js_1.updateSyncStatus)({
            user_id: credentials.userId,
            credits_remaining: company.free_cvs_remaining,
        });
        return {
            valid: true,
            creditsRemaining: company.free_cvs_remaining,
            userId: credentials.userId,
            email: credentials.email,
        };
    }
    catch (error) {
        console.error('License validation error:', error);
        // Fallback to local state
        const syncStatus = (0, database_js_1.getSyncStatus)();
        return {
            valid: syncStatus?.license_valid || false,
            creditsRemaining: syncStatus?.credits_remaining || 0,
            userId: '',
            email: '',
        };
    }
}
async function syncCredits() {
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
                creditsRemaining: (0, database_js_1.getSyncStatus)()?.credits_remaining || 0,
                message: 'Failed to sync credits with cloud',
            };
        }
        // Update local database
        (0, database_js_1.updateSyncStatus)({
            credits_remaining: company.free_cvs_remaining,
            last_sync: new Date().toISOString(),
        });
        return {
            success: true,
            creditsRemaining: company.free_cvs_remaining,
            message: 'Credits synced successfully',
        };
    }
    catch (error) {
        console.error('Credit sync error:', error);
        const syncStatus = (0, database_js_1.getSyncStatus)();
        return {
            success: false,
            creditsRemaining: syncStatus?.credits_remaining || 0,
            message: String(error),
        };
    }
}
async function purchaseCredits(packageSize) {
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
        if (error)
            throw error;
        return {
            success: true,
            checkoutUrl: data.url,
        };
    }
    catch (error) {
        console.error('Purchase error:', error);
        return {
            success: false,
            checkoutUrl: '',
        };
    }
}
async function canProcessCV() {
    try {
        const syncStatus = (0, database_js_1.getSyncStatus)();
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
    }
    catch (error) {
        console.error('Credit check error:', error);
        return {
            allowed: false,
            creditsRemaining: 0,
            message: 'Error checking credits',
        };
    }
}
async function deductCredit() {
    try {
        const syncStatus = (0, database_js_1.getSyncStatus)();
        if (!syncStatus) {
            return {
                success: false,
                creditsRemaining: 0,
            };
        }
        const newCredits = Math.max(0, (syncStatus.credits_remaining || 0) - 1);
        (0, database_js_1.updateSyncStatus)({
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
        }
        catch {
            // Offline - will sync later
        }
        return {
            success: true,
            creditsRemaining: newCredits,
        };
    }
    catch (error) {
        console.error('Deduction error:', error);
        return {
            success: false,
            creditsRemaining: (0, database_js_1.getSyncStatus)()?.credits_remaining || 0,
        };
    }
}
async function clearCredentials() {
    try {
        const credPath = getCredentialsPath();
        if (fs.existsSync(credPath)) {
            fs.unlinkSync(credPath);
        }
    }
    catch (error) {
        console.error('Failed to clear credentials:', error);
    }
}
