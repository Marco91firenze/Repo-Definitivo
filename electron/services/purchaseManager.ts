/**
 * Purchase Manager
 *
 * Handles credit purchases via Stripe (through Supabase edge functions).
 * Only the user's email is sent to the server - no CV data, no PII, no job data.
 */

import { shell } from 'electron';
import { getUserProfile, isPurchaseSynced, markPurchaseSynced } from './database.js';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

interface PurchasePackage {
  name: string;
  credits: number;
  price: string;
}

export const PACKAGES: PurchasePackage[] = [
  { name: 'batch_100', credits: 100, price: '€50' },
  { name: 'batch_1000', credits: 1000, price: '€300' },
];

export async function openCheckout(packageSize: 'batch_100' | 'batch_1000'): Promise<{ success: boolean; error?: string }> {
  const profile = getUserProfile();
  if (!profile) {
    return { success: false, error: 'No user profile found. Please set up your profile first.' };
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { success: false, error: 'Payment service not configured.' };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        email: profile.email,
        packageSize,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Checkout creation failed: ${errorText}`);
    }

    const data = await response.json();

    if (data.url) {
      await shell.openExternal(data.url);
      return { success: true };
    }

    return { success: false, error: 'No checkout URL returned.' };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function syncPurchases(): Promise<{ success: boolean; newCredits: number; error?: string }> {
  const profile = getUserProfile();
  if (!profile) {
    return { success: false, newCredits: 0, error: 'No user profile found.' };
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { success: false, newCredits: 0, error: 'Payment service not configured.' };
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/purchases?email=eq.${encodeURIComponent(profile.email)}&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch purchases');
    }

    const purchases = await response.json();
    let newCredits = 0;

    for (const purchase of purchases) {
      if (!isPurchaseSynced(purchase.stripe_session_id)) {
        markPurchaseSynced(uuidv4(), purchase.stripe_session_id, purchase.credits_purchased);
        newCredits += purchase.credits_purchased;
      }
    }

    return { success: true, newCredits };
  } catch (error) {
    return { success: false, newCredits: 0, error: String(error) };
  }
}
