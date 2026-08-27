import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { auth } from '../config/firebase';
import {
  loginWithApple,
  loginWithEmail,
  loginWithGoogle,
  logout as logoutService,
  mapFirebaseUser,
  registerWithEmail,
} from '../services/authService';
import { fetchUser, saveUserProfile } from '../services/userService';
import { ChatUser } from '../types/user';
import { getErrorMessage } from '../utils/errors';

export type AuthContextValue = {
  user: ChatUser | null;
  isLoading: boolean;
  isAuthenticating: boolean;
  errorMessage: string;
  clearError: () => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isSigningInRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      if (isSigningInRef.current) {
        setIsLoading(false);
        return;
      }

      const mapped = mapFirebaseUser(firebaseUser);
      const stored = await fetchUser(firebaseUser.uid).catch(() => null);

      if (!stored) {
        await saveUserProfile(mapped).catch(() => undefined);
      }

      setUser(stored ? { ...mapped, name: stored.name } : mapped);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setErrorMessage(''), []);

  const runAuthAction = useCallback(async (action: () => Promise<ChatUser>) => {
    try {
      isSigningInRef.current = true;
      setIsAuthenticating(true);
      setErrorMessage('');

      const authenticatedUser = await action();

      setUser(authenticatedUser);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Não foi possível autenticar.'));

      if (auth.currentUser) {
        setUser(mapFirebaseUser(auth.currentUser));
      }
    } finally {
      isSigningInRef.current = false;
      setIsAuthenticating(false);
    }
  }, []);

  const signUp = useCallback(
    (name: string, email: string, password: string) => runAuthAction(() => registerWithEmail(name, email, password)),
    [runAuthAction],
  );

  const signInWithEmail = useCallback(
    (email: string, password: string) => runAuthAction(() => loginWithEmail(email, password)),
    [runAuthAction],
  );

  const signInWithGoogle = useCallback(() => runAuthAction(loginWithGoogle), [runAuthAction]);

  const signInWithApple = useCallback(() => runAuthAction(loginWithApple), [runAuthAction]);

  const signOut = useCallback(async () => {
    try {
      setErrorMessage('');
      await logoutService();
      setUser(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Não foi possível sair da conta.'));
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticating,
      errorMessage,
      clearError,
      signUp,
      signInWithEmail,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }),
    [
      user,
      isLoading,
      isAuthenticating,
      errorMessage,
      clearError,
      signUp,
      signInWithEmail,
      signInWithGoogle,
      signInWithApple,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
