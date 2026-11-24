"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  loginRequest,
  registerRequest,
  saveSession,
  subscribeSession,
  updateProfileRequest,
} from "@/lib/auth-api";
import type {
  AuthStatus,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "@/types/auth";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );

  const user = session ?? null;
  const status: AuthStatus =
    session === undefined ? "loading" : session ? "authenticated" : "guest";

  const login = useCallback(async (payload: LoginPayload) => {
    const loggedIn = await loginRequest(payload);
    saveSession(loggedIn);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const created = await registerRequest(payload);
    saveSession(created); // langsung login setelah daftar
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      if (!user) return;
      const updated = await updateProfileRequest(user.id, payload);
      saveSession(updated);
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, updateProfile }),
    [user, status, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>.");
  }
  return context;
}
