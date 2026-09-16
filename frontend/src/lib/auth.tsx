'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { api, DEMO_MODE } from '@/lib/api';
import { authenticate, hydrateFromApi, loadSession, saveSession } from '@/lib/store';
import type { Role, SessionUser } from '@/lib/types';

interface AuthContextValue {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  can: (...roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = loadSession();
    setUser(session);
    setReady(true);
    void hydrateFromApi(!!session);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authenticate(email, password);
    if (!session) return { ok: false, error: 'Email atau kata sandi tidak cocok.' };
    saveSession(session);
    setUser(session);
    await hydrateFromApi(true);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    if (!DEMO_MODE) api.logout();
    saveSession(null);
    setUser(null);
  }, []);

  const can = useCallback(
    (...roles: Role[]) => !!user && roles.includes(user.role),
    [user],
  );

  const value = useMemo(
    () => ({ user, ready, login, logout, can }),
    [user, ready, login, logout, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
