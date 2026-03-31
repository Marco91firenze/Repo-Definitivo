import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, Zap, AlertCircle } from 'lucide-react';

interface CreditPackage {
  id: string;
  package_name: string;
  cv_count: number;
  price_eur: number;
}

export function CreditsPanel() {
  const { localUser, isLocalMode, syncCreditsFromCloud } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const { data } = await supabase
        .from('credit_packages')
        .select('*')
        .order('cv_count', { ascending: true });
      if (data) setPackages(data);
    } catch (error) {
    }
  };

  const handlePurchase = async (packageName: string) => {
    if (!isLocalMode) return;

    setPurchasing(packageName);
    try {
      const result = await (window as any).electronAPI?.purchaseCredits?.(packageName);
      if (result?.success && result.checkoutUrl) {
        // Open checkout in browser
        const checkoutWindow = window.open(result.checkoutUrl, '_blank', 'width=800,height=600');

        // Poll for completion and refresh credits after payment
        if (checkoutWindow) {
          const interval = setInterval(async () => {
            if (checkoutWindow.closed) {
              clearInterval(interval);
              // Wait a moment then sync credits
              setTimeout(() => {
                handleSyncCredits();
              }, 1000);
            }
          }, 1000);
        }
      }
    } catch (error) {
    } finally {
      setPurchasing(null);
    }
  };

  const handleSyncCredits = async () => {
    setLoading(true);
    try {
      await syncCreditsFromCloud();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!isLocalMode || !localUser) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Credits Remaining</h3>
            <p className="text-3xl font-bold text-blue-600">{localUser.creditsRemaining}</p>
          </div>
          <Zap className="w-12 h-12 text-blue-600 opacity-20" />
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Each CV analysis uses 1 credit. You started with 10 free credits.
        </p>
        <button
          onClick={handleSyncCredits}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync Credits with Cloud'}
        </button>
      </div>

      {localUser.creditsRemaining <= 2 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Low on credits!</p>
            <p className="text-sm">Purchase more credits to continue analyzing CVs.</p>
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Purchase Credits
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-slate-900">{pkg.cv_count} CVs</p>
                  <p className="text-2xl font-bold text-blue-600">€{pkg.price_eur}</p>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  €{(pkg.price_eur / pkg.cv_count).toFixed(2)}/CV
                </p>
              </div>
              <button
                onClick={() => handlePurchase(pkg.package_name)}
                disabled={purchasing === pkg.package_name}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {purchasing === pkg.package_name ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Note:</span> All CV files and analysis results remain on your local machine. Only your credit usage is synced with our servers.
        </p>
      </div>
    </div>
  );
}
