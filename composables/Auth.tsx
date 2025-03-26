import * as React from 'react';
import { supabase } from './supabaseClient';
import { ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Use AsyncStorage for larger session storage

const SignInContext = React.createContext<{
  isSignedIn: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<User | null>;
  refreshUser: () => Promise<User | null>;
}>({
  isSignedIn: false,
  user: null,
  signIn: async (email: string, password: string) => null,
  signOut: async () => {},
  register: async (email: string, password: string, firstName: string, lastName: string) => null,
  refreshUser: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  // Load session from AsyncStorage on app start
  React.useEffect(() => {
    const loadSession = async () => {
      const sessionString = await AsyncStorage.getItem('supabase_session');
      if (sessionString) {
        const session: Session = JSON.parse(sessionString);
        supabase.auth.setSession(session); // Restore the session
        setUser(session.user);
        setIsSignedIn(true);
      }
    };
    loadSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<User | null> => {
    const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
      email, password
    });

    if (error) {
      return Promise.reject(error);
    }

    // Save session to AsyncStorage
    if (session) {
      await AsyncStorage.setItem('supabase_session', JSON.stringify(session));
    }

    setIsSignedIn(true);
    setUser(user);
    return Promise.resolve(user);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return Promise.reject(error);
    }

    // Remove session from AsyncStorage
    await AsyncStorage.removeItem('supabase_session');

    setIsSignedIn(false);
    setUser(null);
    return Promise.resolve();
  };

  const refreshUser = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      return Promise.reject(error);
    }

    // Save updated session to AsyncStorage
    if (data.session) {
      await AsyncStorage.setItem('supabase_session', JSON.stringify(data.session));
    }

    setUser(data.user);
    return Promise.resolve(data.user);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string): Promise<User | null> => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        },
      },
    });

    if (error) {
      return Promise.reject(error);
    }

    // Save session to AsyncStorage
    if (data.session) {
      await AsyncStorage.setItem('supabase_session', JSON.stringify(data.session));
    }

    setIsSignedIn(true);
    setUser(data.user);
    return Promise.resolve(data.user);
  };

  return (
    <SignInContext.Provider value={{ isSignedIn, user, signIn, signOut, register, refreshUser }}>
      {children}
    </SignInContext.Provider>
  );
};

export const useIsSignedIn = () => {
  const context = React.useContext(SignInContext);
  if (!context) {
    throw new Error('useIsSignedIn must be used within an AuthProvider');
  }
  return context.isSignedIn;
};

export const useAuth = () => {
  const context = React.useContext(SignInContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};