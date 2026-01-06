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
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-600/50 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-red-600/20">
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
                      ? 'text-red-500' 
                      : 'text-gray-400'
                  }`} />
                  <span className={
                    isActive 
                      ? 'text-red-500' 
                      : 'text-gray-400 hover:text-gray-200'
                  }>
                    {tab.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
