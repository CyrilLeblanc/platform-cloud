import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';

type User = {
  id?: string;
  email?: string;
  username?: string;
  // add more fields as needed
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user?: User) => void;
  logout: () => void;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_TOKEN_KEY = 'pc_token';
const STORAGE_USER_KEY = 'pc_user_v1';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY);
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (token) localStorage.setItem(STORAGE_TOKEN_KEY, token);
      else localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch (e) {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_USER_KEY);
    } catch (e) {
      // ignore
    }
  }, [user]);

  // Token-based auth: no need to hydrate from server since we store user on login

  const login = (t: string, u?: User) => {
    setToken(t);
    if (u) setUser(u);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({user, token, isAuthenticated: !!(token || user), login, logout, setUser}),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
