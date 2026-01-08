import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, IS_MOCK_MODE } from '../services/supabase';
import { User as AppUser } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, name?: string, gender?: 'female' | 'male' | 'other', shoppingFor?: 'self' | 'gift') => Promise<void>;
  updateProfile: (updates: Partial<AppUser>) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMockMode: boolean;
  isLoading: boolean;
}

export { IS_MOCK_MODE };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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
        console.log('Session found for user:', session.user.email);
        mapSupabaseUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        console.log('Auth state change: login', session.user.email);
        mapSupabaseUser(session.user);
      } else {
        console.log('Auth state change: logout');
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = async (sbUser: SupabaseUser) => {
    try {
      // Fetch profile data
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      // Fallback: Create profile if it doesn't exist
      if (profileError && profileError.code === 'PGRST116') {
        console.log('Profile not found, creating one for:', sbUser.email);
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: sbUser.id,
            email: sbUser.email || '',
            full_name: sbUser.user_metadata?.full_name || 'Usuário',
            is_admin: false // Default to false
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile fallback:', createError);
        } else {
          profile = newProfile;
        }
      }

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

      // Set admin status
      const adminStatus = profile?.is_admin === true;
      console.log(`User ${sbUser.email} admin status: ${adminStatus}`);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error mapping user:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      console.log('Login attempt for:', email);

      if (IS_MOCK_MODE) {
        console.log('Using MOCK MODE login');
        // simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser({
          id: 'mock-id',
          email: email,
          name: 'Cliente VIP (Demo)',
        });
        setIsAdmin(email.toLowerCase().includes('admin'));
        return;
      }

      console.log('Attempting real Supabase login...');
      if (!supabase || !supabase.auth) {
        throw new Error('Supabase client or auth is not initialized properly.');
      }

      if (password) {
        // Debug types before call to prevent "Invalid value"
        console.log('Credentials validation:', {
          emailType: typeof email,
          passwordType: typeof password,
          emailLength: email?.length,
          passwordLength: password?.length
        });

        const { error } = await supabase.auth.signInWithPassword({
          email: String(email).trim(),
          password: String(password),
        });
        if (error) throw error;
      } else {
        console.log('Attempting OTP login...');
        const { error } = await supabase.auth.signInWithOtp({
          email: String(email).trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/#/confirmado`,
          },
        });
        if (error) throw error;
        alert('Link de login enviado para seu email!');
      }
    } catch (error: any) {
      console.error('CRITICAL AUTH ERROR:', error);
      console.error('Error Stack:', error.stack);

      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Invalid value'))) {
        throw new Error('ERRO DE CONEXÃO: O navegador rejeitou a requisição. Verifique se a URL e a Chave do Supabase no .env.local são válidas e não possuem espaços ou aspas extras.');
      }
      throw error;
    }
  };

  const signUp = async (email: string, password?: string, name?: string, gender?: 'female' | 'male' | 'other', shoppingFor?: 'self' | 'gift') => {
    if (IS_MOCK_MODE) {
      // simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: 'mock-id',
        email: email,
        name: name || 'Novo Cliente (Demo)',
        gender,
        shoppingFor,
      });
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password: password || '',
      options: {
        data: {
          full_name: name,
          gender,
          shopping_for: shoppingFor,
        },
        emailRedirectTo: `${window.location.origin}/#/confirmado`,
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
          gender: updates.gender,
          shopping_for: updates.shoppingFor,
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
    try {
      if (IS_MOCK_MODE) {
        console.log('Mock logout successful');
        setUser(null);
        setIsAdmin(false);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        // We still clear the state to ensure the UI updates
      } else {
        console.log('Supabase logout successful');
      }
    } catch (err) {
      console.error('Unexpected logout error:', err);
    } finally {
      setUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, updateProfile, logout, isAuthenticated: !!user, isAdmin, isMockMode: IS_MOCK_MODE, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
