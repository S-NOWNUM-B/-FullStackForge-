'use client';

import { motion } from 'framer-motion';
import { LogOut, LayoutGrid, FileText } from 'lucide-react';
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
    <div className="relative min-h-screen bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-black to-gray-900" />
      <div
        className="absolute inset-0 bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: 'linear-gradient(to right,#4f4f4f20 1px,transparent 1px),linear-gradient(to bottom,#4f4f4f20 1px,transparent 1px)',
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-red-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-sm font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Админ-панель
              </h1>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-linear-to-r from-red-900/30 to-red-800/20 hover:from-red-900/50 hover:to-red-800/40 border border-red-600/30 hover:border-red-600/50 rounded-lg transition-all duration-300 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </motion.button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectsManager />
      </main>
    </div>
  );
}
