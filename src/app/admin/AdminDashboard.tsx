'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Info, Link2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import ProjectsManager from './components/ProjectsManager';
import WorkInfoEditor from './components/WorkInfoEditor';
import SocialLinksEditor from './components/SocialLinksEditor';

type Tab = 'projects' | 'work-info' | 'social-links';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin' });
      toast.success('Вы вышли из системы');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      toast.error('Ошибка при выходе');
    }
  };

  const tabs = [
    { id: 'projects' as Tab, label: 'Проекты', icon: FolderKanban },
    { id: 'work-info' as Tab, label: 'Информация о работе', icon: Info },
    { id: 'social-links' as Tab, label: 'Соц-сети', icon: Link2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Админ-панель
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Управление контентом сайта
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors"
                >
                  <Icon className={`w-4 h-4 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }>
                    {tab.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'work-info' && <WorkInfoEditor />}
          {activeTab === 'social-links' && <SocialLinksEditor />}
        </motion.div>
      </main>
    </div>
  );
}
