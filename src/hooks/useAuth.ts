'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      setLoading(true);
      console.log('useAuth: Initializing...');
      
      // Safety timeout: never stay in loading state for more than 10s
      const timeoutId = setTimeout(() => {
        if (mounted && loading) {
          console.warn('useAuth: Initialization timed out after 10s');
          setLoading(false);
        }
      }, 10000);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) {
        clearTimeout(timeoutId);
        return;
      }

      if (session) {
        console.log('useAuth: Found session, fetching profile...');
        setUser(session.user);
        await fetchProfileWithRetry(session.user.id, session.user);
      } else {
        console.log('useAuth: No session, ending loading.');
        setLoading(false);
      }
      clearTimeout(timeoutId);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session) {
        setUser(session.user);
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          await fetchProfileWithRetry(session.user.id, session.user);
        }
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfileWithRetry = async (userId: string, authUser: User, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data);
                setLoading(false);
                return;
            }

            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, 1000)); // Wait 1s before retry
            }
        } catch (err) {
            // Ignore error and retry
        }
    }

    // Fallback profile if DB fetch fails
    const fallback: Profile = {
        id: userId,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
        avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser.email}`,
        role: 'user',
        created_at: new Date().toISOString()
    };
    setProfile(fallback);
    setLoading(false);
  };

  return { 
    user, 
    profile: profile ? {
        ...profile,
        full_name: profile.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'User',
        avatar_url: profile.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`
    } : null, 
    loading, 
    isAdmin: profile?.role === 'admin' 
  };
}
