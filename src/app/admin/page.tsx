'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import AdminDashboard from './AdminDashboard';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Неверный пароль');
      }
    } catch {
      setError('Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  // Показываем загрузку пока проверяется сессия
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  // Если авторизован, показываем админ панель
  if (session) {
    return <AdminDashboard />;
  }

  // Форма входа
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Админ Панель
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Введите пароль для доступа
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="Введите пароль"
                required
                autoFocus
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              variant="neon"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Защищено NextAuth.js
          </p>
        </div>
      </motion.div>
    </div>
  );
}
