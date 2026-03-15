import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { AuthProvider } from "./auth-provider-inline";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "my-agent",
  description: "個人PM管理・ナレッジベース",
};

// サーバーアクション: ログイン
async function loginAction(password: string) {
  "use server";
  const PASSWORD = process.env.PASSWORD;
  
  if (password !== PASSWORD) {
    return { success: false, error: "パスワードが正しくありません" };
  }

  // トークンを生成（24時間有効）
  const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString("base64");
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24時間
  });

  return { success: true };
}

// サーバーアクション: ログアウト
async function logoutAction() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

// 認証チェック
async function checkAuth() {
  "use server";
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  return { authenticated: !!token };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await checkAuth();

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <AuthProvider 
          initialAuth={auth.authenticated}
          loginAction={loginAction}
          logoutAction={logoutAction}
        >
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
