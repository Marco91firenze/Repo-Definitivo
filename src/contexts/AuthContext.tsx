import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface LocalUserData {
  userId: string;
  email: string;
  companyName: string;
  creditsRemaining: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLocalMode: boolean;
  localUser: LocalUserData | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, companyName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  localSignIn: (email: string, password: string) => Promise<void>;
  localSignUp: (email: string, password: string, companyName: string) => Promise<void>;
  localSignOut: () => Promise<void>;
  syncCreditsFromCloud: () => Promise<number>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalMode] = useState(() => typeof window !== 'undefined' && !!(window as any).electronAPI);
  const [localUser, setLocalUser] = useState<LocalUserData | null>(null);

  useEffect(() => {
    if (isLocalMode) {
      // Load local credentials from electron
      const loadLocalUser = async () => {
        try {
          const result = await (window as any).electronAPI?.validateLicense();
          if (result?.success && result.data) {
            setLocalUser({
              userId: result.data.userId,
              email: result.data.email,
              companyName: result.data.email.split('@')[0],
              creditsRemaining: result.data.creditsRemaining,
            });
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      loadLocalUser();
    } else {
      // Cloud mode - use Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          setSession(session);
          setUser(session?.user ?? null);
        })();
      });

      return () => subscription.unsubscribe();
    }
  }, [isLocalMode]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, companyName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      const { error: companyError } = await supabase.from('companies').insert({
        id: data.user.id,
        email,
        company_name: companyName,
        free_cvs_remaining: 10,
        total_cvs_processed: 0,
      });
      if (companyError) throw companyError;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = window.location.origin.includes('localhost')
      ? 'http://localhost:5173/reset-password'
      : `${window.location.origin}/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) throw error;
  };

  const localSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const { data: company } = await supabase
          .from('companies')
          .select('company_name, free_cvs_remaining')
          .eq('id', data.user.id)
          .maybeSingle();

        if (company) {
          setLocalUser({
            userId: data.user.id,
            email,
            companyName: company.company_name,
            creditsRemaining: company.free_cvs_remaining,
          });

          // Save to electron storage
          if ((window as any).electronAPI?.saveCredentials) {
            await (window as any).electronAPI.saveCredentials(data.user.id, email);
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const localSignUp = async (email: string, password: string, companyName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const { error: companyError } = await supabase.from('companies').insert({
          id: data.user.id,
          email,
          company_name: companyName,
          free_cvs_remaining: 10,
          total_cvs_processed: 0,
        });
        if (companyError) throw companyError;

        setLocalUser({
          userId: data.user.id,
          email,
          companyName,
          creditsRemaining: 10,
        });

        // Save to electron storage
        if ((window as any).electronAPI?.saveCredentials) {
          await (window as any).electronAPI.saveCredentials(data.user.id, email);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const localSignOut = async () => {
    setLocalUser(null);
    if ((window as any).electronAPI?.clearCredentials) {
      await (window as any).electronAPI.clearCredentials();
    }
  };

  const syncCreditsFromCloud = async () => {
    try {
      const result = await (window as any).electronAPI?.syncCredits?.();
      if (result?.success && localUser) {
        setLocalUser({
          ...localUser,
          creditsRemaining: result.data.creditsRemaining,
        });
        return result.data.creditsRemaining;
      }
      return localUser?.creditsRemaining ?? 0;
    } catch (error) {
      return localUser?.creditsRemaining ?? 0;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isLocalMode,
        localUser,
        signIn,
        signUp,
        signOut,
        resetPassword,
        localSignIn,
        localSignUp,
        localSignOut,
        syncCreditsFromCloud,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
