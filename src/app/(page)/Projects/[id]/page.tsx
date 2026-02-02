'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Loader2,
  Calendar,
  Code2,
  Globe,
  FileText,
  Cpu,
  CheckCircle2,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Project } from '@/types/api';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'process' | 'results'>('overview');

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-black to-gray-900" />
        <Loader2 className="relative z-10 w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-black to-gray-900" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Проект не найден</h1>
          <Link href="/Projects">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Вернуться к проектам
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const processSteps = project.processSteps || [];
  const resultMetrics = project.resultMetrics || [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Content */}
      <main className="relative z-10 w-full">
        {/* Hero Section */}
        <section className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            {/* Back Button */}
            <Link href="/Projects" className="inline-block mb-8">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Вернуться к проектам</span>
              </button>
            </Link>

            {/* Project Header */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-red-600/10 text-red-400 rounded-full text-sm font-medium border border-red-600/20">
                  {project.category}
                </span>
                {project.clientName && (
                  <span className="px-4 py-1.5 bg-gray-800/50 text-gray-300 rounded-full text-sm font-medium border border-gray-700/50 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {project.clientName}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {project.title}
              </h1>

              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mb-8 leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-6">
                {project.startedAt && project.completedAt && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide">Длительность</div>
                      <div className="text-white font-semibold">
                        {new Date(project.startedAt).toLocaleDateString('ru-RU', {
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(project.completedAt).toLocaleDateString('ru-RU', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white hover:border-red-600/50 hover:bg-gray-800 transition-all"
                  >
                    <Github className="w-5 h-5" />
                    Посмотреть код
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 border border-red-600 rounded-lg text-white hover:bg-red-700 transition-all font-semibold"
                  >
                    <Globe className="w-5 h-5" />
                    Открыть проект
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-800 sticky top-0 bg-black/50 backdrop-blur-md z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                  activeTab === 'overview'
                    ? 'text-white border-red-600'
                    : 'text-gray-400 border-transparent hover:text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline-block mr-2" />
                Обзор
              </button>

              {processSteps.length > 0 && (
                <button
                  onClick={() => setActiveTab('process')}
                  className={`px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === 'process'
                      ? 'text-white border-red-600'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  Процесс
                </button>
              )}

              {resultMetrics.length > 0 && (
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-6 py-4 font-semibold transition-all whitespace-nowrap border-b-2 ${
                    activeTab === 'results'
                      ? 'text-white border-red-600'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  Результаты
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {project.thumbnail && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                  <div className="relative w-full h-80 md:h-100 lg:h-125 bg-gray-800">
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {/* Main Description */}
              {project.fullDescription && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-red-600" />
                    О проекте
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {project.fullDescription}
                  </p>
                </div>
              )}

              {/* Functionality */}
              {project.functionality && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-red-600" />
                    Основной функционал
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {project.functionality}
                  </p>
                </div>
              )}

              {/* Challenges */}
              {project.challenges && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-red-600" />
                    Вызовы и решения
                  </h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                    {project.challenges}
                  </p>
                </div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-red-600" />
                    Используемые технологии
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
              )}
            </div>
          )}

          {/* Process Tab */}
          {activeTab === 'process' && processSteps.length > 0 && (
            <div className="space-y-8">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-red-600/50 via-red-600/30 to-transparent transform md:-translate-x-1/2" />

                {/* Steps */}
                <div className="space-y-8 md:space-y-12">
                  {processSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`relative flex gap-6 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-0 md:left-1/2 top-6 md:top-0 w-9 h-9 bg-red-600 rounded-full border-4 border-black transform md:-translate-x-1/2 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className={`flex-1 pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                              {step.startDate && step.endDate && (
                                <div className="text-sm text-gray-400 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(step.startDate).toLocaleDateString('ru-RU', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}{' '}
                                  -{' '}
                                  {new Date(step.endDate).toLocaleDateString('ru-RU', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </div>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                step.status === 'completed'
                                  ? 'bg-green-600/20 text-green-400'
                                  : step.status === 'in-progress'
                                    ? 'bg-yellow-600/20 text-yellow-400'
                                    : 'bg-gray-700/50 text-gray-400'
                              }`}
                            >
                              {step.status === 'completed'
                                ? 'Завершено'
                                : step.status === 'in-progress'
                                  ? 'В процессе'
                                  : 'Запланировано'}
                            </span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && resultMetrics.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="bg-gray-900/40 border border-gray-800 rounded-xl p-8 text-center hover:border-red-600/50 transition-all"
                >
                  <div className="text-4xl md:text-5xl font-bold text-red-600 mb-3">
                    {metric.value}
                    {metric.type === 'percentage' && '%'}
                    {metric.type === 'currency' && '₽'}
                  </div>
                  <p className="text-gray-300 text-lg font-semibold">{metric.label}</p>
                  {metric.type && (
                    <p className="text-gray-400 text-xs uppercase tracking-widest mt-3">
                      {metric.type === 'percentage' && 'Процент'}
                      {metric.type === 'number' && 'Количество'}
                      {metric.type === 'time' && 'Время'}
                      {metric.type === 'currency' && 'Сумма'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {(project.githubUrl || project.demoUrl) && (
              <div className="flex gap-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gray-800/30 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg transition-all"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-white bg-red-600 hover:bg-red-700 border border-red-600 rounded-lg transition-all font-semibold"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
