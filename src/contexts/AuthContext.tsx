
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userRoles: AppRole[];
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: AppRole) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type SupabaseError = {
  message?: string;
  code?: string;
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'An unexpected error occurred';

const isJwtSignatureError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const { message, code } = error as SupabaseError;
  if (code === 'PGRST301') {
    return true;
  }

  if (typeof message === 'string') {
    const normalized = message.toLowerCase();
    return normalized.includes('jwserror') || normalized.includes('jwkinvalid') || normalized.includes('jwsinvalidsignature');
  }

  return false;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const clearInvalidSession = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.warn('Failed to sign out after invalid token detection:', signOutError);
    }

    setSession(null);
    setUser(null);
    setUserRoles([]);

    toast({
      title: 'Session expired',
      description: 'Please sign in again to continue.',
      variant: 'destructive',
    });
  }, [toast]);

  // Function to fetch user roles from database
  const fetchUserRoles = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) {
        if (isJwtSignatureError(error)) {
          console.warn('Invalid Supabase session detected while fetching roles:', error);
          await clearInvalidSession();
        } else {
          console.error('Error fetching user roles:', error);
        }
        return;
      }
      
      if (data) {
        setUserRoles(data.map(item => item.role as AppRole));
      }
    } catch (error) {
      if (isJwtSignatureError(error)) {
        console.warn('Invalid Supabase session detected while fetching roles:', error);
        await clearInvalidSession();
      } else {
        console.error('Error in fetchUserRoles:', error);
      }
    }
  }, [clearInvalidSession]);

  // Set up auth state listener
  useEffect(() => {
    setIsLoading(true);

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Fetch roles if user is logged in (using setTimeout to prevent deadlocks)
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRoles(currentSession.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }

        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error && isJwtSignatureError(error)) {
        await clearInvalidSession();
        setIsLoading(false);
        return;
      }

      const { session: currentSession } = data;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchUserRoles(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRoles, clearInvalidSession]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        throw error;
      }

      // Create initial profile for the new user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error (non-blocking):', profileError);
          // Don't throw - profile might already exist or will be created on first save
        }
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast({
        title: "Sign out failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Check if user has a specific role
  const hasRole = (role: AppRole): boolean => {
    return userRoles.includes(role);
  };

  const value = {
    session,
    user,
    userRoles,
    isLoading,
    signIn,
    signUp,
    signOut,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
