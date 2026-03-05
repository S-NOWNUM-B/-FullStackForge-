"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AdminDashboard from "./AdminDashboard";
import SecuritySetup from "./components/SecuritySetup";
import PasswordReset from "./components/PasswordReset";

type AdminMode = "loading" | "login" | "setup" | "reset";

export default function AdminPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [mode, setMode] = useState<AdminMode>("loading");
  const [securityData, setSecurityData] = useState<{
    isSetup: boolean;
    question: string | null;
  }>({
    isSetup: false,
    question: null,
  });

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Проверяем статус безопасности при загрузке
  const checkSecurityStatus = async () => {
    try {
      const res = await fetch("/api/admin/security/status");
      const data = await res.json();
      setSecurityData(data);

      if (!data.isSetup) {
        setMode("setup");
      } else {
        setMode("login");
      }
    } catch {
      setMode("login");
    }
  };

  useEffect(() => {
    if (sessionStatus !== "loading") {
      checkSecurityStatus();
    }
  }, [sessionStatus]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный пароль");
      }
    } catch {
      setError("Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  if (sessionStatus === "loading" || mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-900 via-black to-gray-900">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (session) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-900 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-600 to-transparent opacity-50" />

          <AnimatePresence mode="wait">
            {mode === "setup" && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SecuritySetup onComplete={() => checkSecurityStatus()} />
              </motion.div>
            )}

            {mode === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PasswordReset
                  question={securityData.question || ""}
                  onBack={() => setMode("login")}
                  onSuccess={() => setMode("login")}
                />
              </motion.div>
            )}

            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col items-center justify-center gap-3 mb-10 text-center">
                  <div className="flex items-center justify-center w-12 h-12 shrink-0 bg-red-600/10 rounded-xl border border-red-600/20">
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-xl font-bold text-white leading-tight">
                      Админ-панель
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Панель управления
                    </p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all"
                      placeholder="••••••••"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-2 rounded-lg"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    variant="neon"
                    className="w-full py-6 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      "Войти в систему"
                    )}
                  </Button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
              Защищено FullStackForge Security Suite
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
