'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ProjectEditor from '@/app/admin/components/ProjectEditor';

export default function NewProjectPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Предотвращаем hydration issues
  if (!mounted && typeof window !== 'undefined') {
    setMounted(true);
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-black">
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
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-red-600/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div />
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-lg transition-all active:scale-95 duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ProjectEditor
            project={null}
            onClose={() => router.back()}
            onSave={() => router.push('/admin')}
          />
        </motion.div>
      </main>
    </div>
  );
}
