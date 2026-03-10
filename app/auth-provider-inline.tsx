"use client";

import { createContext, useContext, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function AuthProvider({
  children,
  initialAuth,
  loginAction,
  logoutAction,
}: {
  children: React.ReactNode;
  initialAuth: boolean;
  loginAction: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAction: () => Promise<void>;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 24時間経過チェック（ページ遷移時に自動的にチェックされる）
  // cookieのmaxAgeが24時間なので、ブラウザが自動的に期限切れを管理
  // ページをリロードまたは遷移すると、サーバー側で認証チェックが行われる
  useEffect(() => {
    if (!isAuthenticated) return;

    // 24時間後に自動ログアウト（ページを開き続けている場合の対策）
    const timeout = setTimeout(() => {
      setIsAuthenticated(false);
      logoutAction().then(() => {
        startTransition(() => {
          router.refresh();
        });
      });
    }, 24 * 60 * 60 * 1000); // 24時間

    return () => clearTimeout(timeout);
  }, [isAuthenticated, logoutAction, router]);

  const login = async (password: string) => {
    const result = await loginAction(password);
    if (result.success) {
      setIsAuthenticated(true);
      startTransition(() => {
        router.refresh();
      });
    }
    return result;
  };

  const logout = async () => {
    await logoutAction();
    setIsAuthenticated(false);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
