import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';

export interface AuthState {
  user: { email: string; id: string; role: string } | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      if (!isSupabaseConfigured()) {
        const demoUser = mockStore.getDemoAuthUser();
        if (mounted) {
          if (demoUser) {
            setAuthState({
              user: { email: demoUser.email, id: 'demo-admin-id', role: demoUser.role },
              loading: false,
              isAdmin: demoUser.role === 'admin',
            });
          } else {
            setAuthState({ user: null, loading: false, isAdmin: false });
          }
        }
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          if (mounted) setAuthState({ user: null, loading: false, isAdmin: false });
          return;
        }

        // Fetch user profile role from Supabase PostgreSQL
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = profile?.role || 'customer';
        const isAdmin = role === 'admin';

        if (mounted) {
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              role: role,
            },
            loading: false,
            isAdmin,
          });
        }
      } catch (e) {
        console.error('Session check error:', e);
        if (mounted) setAuthState({ user: null, loading: false, isAdmin: false });
      }
    }

    checkSession();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session?.user) {
          if (mounted) setAuthState({ user: null, loading: false, isAdmin: false });
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const role = profile?.role || 'customer';
        if (mounted) {
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              role,
            },
            loading: false,
            isAdmin: role === 'admin',
          });
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      // In local demo mode: allow demo credentials or any test admin login
      if (email.toLowerCase() === 'admin@foxmedia.com' && password === 'admin123') {
        const demoUser = { email, role: 'admin' };
        mockStore.setDemoAuthUser(demoUser);
        setAuthState({
          user: { email, id: 'demo-admin-id', role: 'admin' },
          loading: false,
          isAdmin: true,
        });
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Demo Mode: Use "admin@foxmedia.com" with password "admin123".'
        };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (!data.user) throw new Error('No user returned from login');

      // Verify admin role
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileErr || profile?.role !== 'admin') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access denied: Your account does not have administrator privileges.'
        };
      }

      setAuthState({
        user: { id: data.user.id, email: data.user.email || '', role: 'admin' },
        loading: false,
        isAdmin: true,
      });

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      mockStore.setDemoAuthUser(null);
      setAuthState({ user: null, loading: false, isAdmin: false });
      return;
    }

    await supabase.auth.signOut();
    setAuthState({ user: null, loading: false, isAdmin: false });
  };

  return {
    ...authState,
    login,
    logout,
  };
}
