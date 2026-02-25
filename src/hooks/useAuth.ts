import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { type User, dbProfileToUser } from '@/lib/store';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!isSupabaseConfigured());
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    // If Supabase is not configured, skip initialization
    if (!isSupabaseConfigured()) {
      console.warn('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY environment variables.');
      return;
    }

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setAuthUserId(session.user.id);
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          if (data) setUser(dbProfileToUser(data));
          else setUser(null);
        } else {
          setUser(null);
          setAuthUserId(null);
        }
        setLoading(false);
      });

      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (session?.user) {
          setAuthUserId(session.user.id);
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          if (data) setUser(dbProfileToUser(data));
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth error:', error);
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    setUser(null);
  };

  return { user, loading, authUserId, signOut };
}
