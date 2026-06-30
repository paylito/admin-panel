import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin } from '../api/client';
import { AuthContext } from './context';

const TOKEN_KEY = 'payli.admin.token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const login = useCallback(async (id: string, secret: string) => {
    const result = await apiLogin(id, secret);
    localStorage.setItem(TOKEN_KEY, result.token);
    setToken(result.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, login, logout }),
    [token, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
