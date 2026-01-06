'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-600/10 rounded-full border border-red-600/20">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Что-то пошло не так
        </h1>

        <p className="text-gray-400 mb-8">
          Произошла ошибка при загрузке страницы. Попробуйте перезагрузить страницу или вернуться на главную.
        </p>

        {error.message && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="neon"
            size="lg"
          >
            Попробовать снова
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
            size="lg"
          >
            На главную
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
