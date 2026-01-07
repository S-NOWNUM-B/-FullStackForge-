'use client';

import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import ProjectsManager from './components/ProjectsManager';

export default function AdminDashboard() {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin' });
      toast.success('Вы вышли из системы');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      toast.error('Ошибка при выходе');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Effects - как на основном сайте */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Header */}
      <header className="relative z-10 sticky top-0 bg-black/50 backdrop-blur-xl border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Админ-панель
              </h1>
              <p className="text-sm text-gray-400">
                Управление контентом сайта
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ProjectsManager />
        </motion.div>
      </main>
    </div>
  );
}
