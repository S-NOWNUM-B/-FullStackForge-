import NextAuth from "next-auth";
import { authConfig } from "./config/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Настройка путей, которые должен обрабатывать middleware
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
