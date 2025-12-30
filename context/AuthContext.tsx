import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, IS_MOCK_MODE } from '../services/supabase';
import { User as AppUser } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, name?: string) => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (IS_MOCK_MODE) {
      console.warn('Running in Auth MOCK MODE. No Supabase keys found.');
      setIsLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = async (sbUser: SupabaseUser) => {
    try {
      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      setUser({
        id: sbUser.id,
        email: sbUser.email || '',
        name: profile?.full_name || sbUser.user_metadata?.full_name || 'Usuário',
        phone: profile?.phone,
        cpf: profile?.cpf,
        birthDate: profile?.birth_date,
        address: profile?.address,
        preferences: profile?.preferences,
      });
    } catch (error) {
      console.error('Error mapping user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    if (IS_MOCK_MODE) {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'mock-id',
        email: email,
        name: 'Cliente VIP (Demo)',
      });
      return;
    }

    if (password) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      alert('Link de login enviado para seu email!');
    }
  };

  const signUp = async (email: string, password?: string, name?: string) => {
    if (IS_MOCK_MODE) {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'mock-id',
        email: email,
        name: name || 'Novo Cliente (Demo)',
      });
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password: password || '',
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;

    // If signup is successful and we have a user but maybe no session yet (email confirmation)
    if (data.user && !data.session) {
      alert('Verifique seu e-mail para confirmar o cadastro!');
    }
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (IS_MOCK_MODE) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.name,
          phone: updates.phone,
          cpf: updates.cpf,
          birth_date: updates.birthDate,
          address: updates.address,
          preferences: updates.preferences,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (IS_MOCK_MODE) {
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, updateProfile, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
