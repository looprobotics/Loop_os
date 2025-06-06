
'use client';

import type { PropsWithChildren} from 'react';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // Start true until check is done
  const router = useRouter();

  useEffect(() => {
    // Check localStorage on initial load
    try {
      const storedAuth = localStorage.getItem('isAuthenticatedFleetApp');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      // Handle environments where localStorage is not available, or set a default
    }
    setIsLoadingAuth(false); // Finished initial auth check
  }, []);

  const login = useCallback(async (username: string, pass: string): Promise<boolean> => {
    // Hardcoded credentials
    if (username === 'Devendra@123' && pass === 'Test@123') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('isAuthenticatedFleetApp', 'true');
      } catch (error) {
        console.error("Could not set localStorage:", error);
      }
      router.push('/'); // Redirect to dashboard or desired page
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('isAuthenticatedFleetApp');
    } catch (error) {
      console.error("Could not remove from localStorage:", error);
    }
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoadingAuth, login, logout }}>
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
