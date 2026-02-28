"use client";

import { useState } from "react";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PasswordResetProps {
  question: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PasswordReset({
  question,
  onBack,
  onSuccess,
}: PasswordResetProps) {
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/security/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || "Не удалось сбросить пароль");
      }
    } catch {
      setError("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <KeyRound className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Восстановление доступа
        </h2>
        <p className="text-sm text-gray-400">
          Ответьте на секретный вопрос, чтобы задать новый пароль.
        </p>
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">
          Ваш вопрос:
        </p>
        <p className="text-white font-medium">{question}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Ваш ответ</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 outline-none"
            placeholder="Введите секретный ответ"
            required
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Новый пароль
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 outline-none"
            placeholder="Введите новый пароль"
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center font-medium bg-red-500/10 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-2 pt-2">
          <Button
            type="submit"
            variant="neon"
            className="w-full"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Сбросить и войти
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
            onClick={onBack}
            disabled={loading}
          >
            Назад к логину
          </Button>
        </div>
      </form>
    </div>
  );
}
