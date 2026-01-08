'use client';

import { useState, useEffect, use, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Loader2, Calendar, FolderOpen, Code2, Globe, FileText, Cpu, Target, Award, Info } from 'lucide-react';
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
  startedAt?: string;
  completedAt?: string;
  challenges?: string;
  results?: string;
  createdAt: string;
}

// Функция для расчета продолжительности проекта
const calculateDuration = (startDate?: string, endDate?: string): string | null => {
  if (!startDate || !endDate) return null;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    if (days === 0) {
      return `${weeks} ${weeks === 1 ? 'неделя' : weeks < 5 ? 'недели' : 'недель'}`;
    }
    return `${weeks} ${weeks === 1 ? 'неделя' : weeks < 5 ? 'недели' : 'недель'} ${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`;
  } else {
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    if (days === 0) {
      return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
    }
    return `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'} ${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}`;
  }
};

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
          <div className="mb-8">
          </div>

          {/* Заголовок и мета-информация */}
          <div className="text-center mb-12">
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
          </div>

          {/* Галерея изображений - полная ширина */}
          {allImages.length > 0 && (
            <div className="mb-12">
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
            </div>
          )}

          {/* Модульная сетка: Описание и Функционал */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Описание проекта */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-red-600" />
                О проекте
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.fullDescription}
                </p>
              </div>
            </div>

            {/* Функционал */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-red-600" />
                Функционал
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {project.functionality || 'Информация о функционале будет добавлена позже.'}
                </p>
              </div>
            </div>
          </div>

          {/* Технологии - полная ширина */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-red-600" />
              Технологии
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm font-medium border border-gray-700/50 hover:border-red-600/50 hover:text-white transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Дополнительная информация */}
          {(project.challenges || project.results || project.clientName || project.startedAt || project.completedAt) && (
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Вызовы и проблемы */}
              {project.challenges && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-red-600" />
                    Вызовы и проблемы
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.challenges}
                  </p>
                </div>
              )}

              {/* Результаты */}
              {project.results && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-red-600" />
                    Результаты
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {project.results}
                  </p>
                </div>
              )}

              {/* Информация о клиенте и продолжительности */}
              {(project.clientName || (project.startedAt && project.completedAt) || project.completedAt) && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8 lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Info className="w-6 h-6 text-red-600" />
                    Информация о проекте
                  </h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.clientName && (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">Клиент</div>
                        <div className="text-white font-medium">{project.clientName}</div>
                      </div>
                    )}
                    {calculateDuration(project.startedAt, project.completedAt) && (
                      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                        <div className="text-sm text-gray-400 mb-1">Длительность</div>
                        <div className="text-white font-medium">{calculateDuration(project.startedAt, project.completedAt)}</div>
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
                </div>
              )}
            </div>
          )}

          {/* Кнопка назад внизу */}
          <div className="flex justify-center">
          </div>
        </div>
      </main>
    </div>
  );
}
