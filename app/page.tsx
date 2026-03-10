import { cookies } from "next/headers";
import { HomeContent } from "./home-content";
import { LoginForm } from "./login-form";

// 認証チェック
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  return !!token;
}

export default async function HomePage() {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <HomeContent />;
}
