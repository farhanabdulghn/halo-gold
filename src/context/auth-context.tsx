import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

type LoginResult = { success: true } | { success: false; message: string };

type AuthContextValue = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Minimal mock authentication provider.
 *
 * The technical test scope does not require a real backend, so this
 * simulates a network round-trip and accepts any well-formed
 * email + password (min. 4 characters) combination.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const trimmedEmail = email.trim();
    const isValidEmail = /^\S+@\S+\.\S+$/.test(trimmedEmail);

    if (!trimmedEmail || !password) {
      return { success: false, message: 'Email dan kata sandi wajib diisi.' };
    }

    if (!isValidEmail) {
      return { success: false, message: 'Format email tidak valid.' };
    }

    if (password.length < 4) {
      return { success: false, message: 'Kata sandi minimal 4 karakter.' };
    }

    // Simulate an authentication API call.
    await new Promise((resolve) => setTimeout(resolve, 400));

    setUserEmail(trimmedEmail);
    return { success: true };
  };

  const logout = () => setUserEmail(null);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: userEmail !== null, userEmail, login, logout }),
    [userEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
