'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Loader2, Calendar, FolderOpen, Code2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  functionality: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  clientName?: string;
  projectDuration?: string;
  completedAt?: string;
  challenges?: string;
  results?: string;
  createdAt: string;
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${resolvedParams.id}`);
      const data = await res.json();

      if (data.success && data.data) {
        setProject(data.data);
        setSelectedImage(data.data.thumbnail || '');
      }
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
        <Loader2 className="relative z-10 w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Проект не найден</h1>
          <Link href="/Projects">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к проектам
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [project.thumbnail, ...project.images].filter(Boolean);

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Content */}
      <main className="relative z-10 w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Кнопка назад */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
          </motion.div>

          {/* Заголовок и мета-информация */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-red-600/10 text-red-400 rounded-full text-sm font-medium border border-red-600/20">
                {project.category}
              </span>
              <span className="flex items-center gap-1 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              {project.shortDescription}
            </p>

            {/* Ссылки на GitHub и Demo */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:border-red-600 transition-all"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/30 border border-gray-700/50 rounded-lg text-gray-500 cursor-not-allowed">
                  <Github className="w-5 h-5" />
                  GitHub
                  <span className="text-xs">Недоступно</span>
                </div>
              )}

              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 border border-red-600 rounded-lg text-white hover:bg-red-700 transition-all"
                >
                  <Globe className="w-5 h-5" />
                  Демо
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/30 border border-gray-700/50 rounded-lg text-gray-500 cursor-not-allowed">
                  <Globe className="w-5 h-5" />
                  Демо
                  <span className="text-xs">Недоступно</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Галерея изображений - полная ширина */}
          {allImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-red-600" />
                  Галерея проекта
                </h2>
                <div className="space-y-4">
                  {/* Главное изображение */}
                  <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
                    <Image
                      src={selectedImage || allImages[0]}
                      alt={project.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Миниатюры */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {allImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === img
                              ? 'border-red-600 scale-95'
                              : 'border-gray-700/50 hover:border-red-600/50'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${project.title} - изображение ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Модульная сетка: Описание и Функционал */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Описание проекта */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">О проекте</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.fullDescription}
                </p>
              </div>
            </motion.div>

            {/* Функционал */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-red-600" />
                Функционал
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.functionality || 'Информация о функционале будет добавлена позже.'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Технологии - полная ширина */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Технологии</h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm font-medium border border-gray-700/50 hover:border-red-600/50 hover:text-white transition-all"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Дополнительная информация */}
          {(project.challenges || project.results || project.clientName || project.projectDuration || project.completedAt) && (
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Вызовы и проблемы */}
              {project.challenges && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Вызовы и проблемы</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.challenges}
                  </p>
                </motion.div>
              )}

              {/* Результаты */}
              {project.results && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Результаты</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.results}
                  </p>
                </motion.div>
              )}

              {/* Информация о клиенте и продолжительности */}
              {(project.clientName || project.projectDuration || project.completedAt) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8 lg:col-span-2"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Информация о проекте</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.clientName && (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">Клиент</div>
                        <div className="text-white font-medium">{project.clientName}</div>
                      </div>
                    )}
                    {project.projectDuration && (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">Длительность</div>
                        <div className="text-white font-medium">{project.projectDuration}</div>
                      </div>
                    )}
                    {project.completedAt ? (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">Дата завершения</div>
                        <div className="text-white font-medium">
                          {new Date(project.completedAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">Категория</div>
                        <div className="text-white font-medium">{project.category}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Кнопка назад внизу */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center"
          >
          </motion.div>
        </div>
      </main>
    </div>
  );
}
