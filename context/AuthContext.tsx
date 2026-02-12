import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { User as AppUser } from '../types';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncProfile = useMutation(api.profiles.createOrUpdate);

  // Fetch Convex profile
  const profile = useQuery(api.profiles.getByClerkId,
    clerkUser ? { clerkUserId: clerkUser.id } : "skip"
  );

  // Map Clerk user to AppUser and sync with Convex profile
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      // Sync with Convex
      syncProfile({
        clerkUserId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        fullName: clerkUser.fullName || undefined,
      }).catch(err => console.error("Error syncing profile:", err));

      setAppUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'Usuário',
        phone: profile?.phone, // Sync phone if available in Convex
      });

      // Sync admin status from Convex profile
      if (profile !== undefined) {
        setIsAdmin(profile?.isAdmin === true);
      }
    } else {
      setAppUser(null);
      setIsAdmin(false);
    }
  }, [isLoaded, isSignedIn, clerkUser?.id, profile, syncProfile]);

  // Clerk handles login/signup via its components
  const login = async (_email: string, _password?: string) => {
    throw new Error('Use Clerk <SignIn /> component for login');
  };

  const signUp = async (_email: string, _password?: string, _name?: string, _gender?: 'female' | 'male' | 'other', _shoppingFor?: 'self' | 'gift') => {
    throw new Error('Use Clerk <SignUp /> component for sign up');
  };

  const updateProfileFn = async (updates: Partial<AppUser>) => {
    if (!clerkUser) return;
    // Optimistic update locally — Convex profile sync will be added when backend is deployed
    setAppUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const logout = async () => {
    try {
      await signOut();
      setAppUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err);
      setAppUser(null);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user: appUser,
      login,
      signUp,
      updateProfile: updateProfileFn,
      logout,
      isAuthenticated: !!appUser,
      isAdmin,
      isMockMode: false,
      isLoading: !isLoaded,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
