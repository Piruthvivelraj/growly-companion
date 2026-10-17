import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // In Demo / Local Mode
      const storedDemoUser = localStorage.getItem('growly_demo_user');
      if (storedDemoUser) {
        setUser(JSON.parse(storedDemoUser));
      } else {
        const defaultUser = {
          id: 'demo-user-1',
          email: 'demo@growly.app',
          user_metadata: { name: 'Growth Explorer', is_demo: true }
        };
        localStorage.setItem('growly_demo_user', JSON.stringify(defaultUser));
        setUser(defaultUser);
      }
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    // Supabase is configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsDemoMode(!session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsDemoMode(!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase credentials are not configured. Currently in Local Demo Mode.' } };
    }
    const res = await supabase.auth.signInWithPassword({ email, password });
    return res;
  };

  const signup = async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase credentials are not configured. Running in Local Demo Mode.' } };
    }
    const res = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    return res;
  };

  const logout = async () => {
    if (isSupabaseConfigured && session) {
      await supabase.auth.signOut();
    }
    // Set fallback demo user
    const defaultUser = {
      id: 'demo-user-1',
      email: 'demo@growly.app',
      user_metadata: { name: 'Growth Explorer', is_demo: true }
    };
    setUser(defaultUser);
    setIsDemoMode(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemoMode,
        isSupabaseConfigured,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
