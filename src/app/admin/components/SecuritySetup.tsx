"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SecuritySetupProps {
  onComplete: () => void;
}

export default function SecuritySetup({ onComplete }: SecuritySetupProps) {
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/security/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, question, answer }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(onComplete, 2000);
      } else {
        setError(data.error || "Ошибка при настройке");
      }
    } catch {
      setError("Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <ShieldCheck className="w-10 h-10 text-green-500" />
          </motion.div>
        </div>
        <h2 className="text-xl font-bold text-white">
          Безопасность настроена!
        </h2>
        <p className="text-gray-400">
          Теперь вы можете войти в панель управления.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">
          Настройка безопасности
        </h2>
        <p className="text-sm text-gray-400">
          Пожалуйста, установите мастер-пароль и секретный вопрос для
          восстановления доступа.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Новый пароль админа
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 outline-none"
            placeholder="Придумайте надежный пароль"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Секретный вопрос
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 outline-none"
            placeholder="Например: Кличка первого питомца?"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Ответ на вопрос
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-600 outline-none"
            placeholder="Ваш секретный ответ"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          variant="neon"
          className="w-full"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Сохранить настройки
        </Button>
      </form>
    </div>
  );
}
