'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Eye, Search, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  technologies: string[];
  category: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);

  const fetchFilters = async () => {
    try {
      const res = await fetch('/api/projects/filters');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        // Используем динамический список технологий из базы данных
        setTechnologies(data.technologies || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки фильтров:', error);
      // В случае ошибки используем пустой массив
      setTechnologies([]);
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      // Формируем URL с параметрами для серверной фильтрации и пагинации
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort: sortOrder,
      });

      if (search) params.append('search', search);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedTech !== 'all') params.append('tech', selectedTech);

      const res = await fetch(`/api/projects?${params.toString()}`, {
        // Отключаем кэш для корректной работы поиска и фильтров
        cache: 'no-store'
      });
      const data = await res.json();

      if (data.success) {
        setProjects(data.projects || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      setLoading(false);
    }
  }, [search, selectedCategory, selectedTech, sortOrder, page]);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedTech('all');
    setSortOrder('newest');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'all' || selectedTech !== 'all' || sortOrder !== 'newest';

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Background Effects - такой же как на главной */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Content */}
      <main className="relative z-10 w-full py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white">
                Мои <span className="text-red-600 font-semibold">проекты</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Здесь собраны мои работы и разработки
            </p>
          </div>

          {/* Поиск и фильтры */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
              <div className="space-y-4">
                {/* Первая строка: Поиск */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Поиск */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Поиск по названию, описанию или технологиям..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Вторая строка: Фильтры */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Категория */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-900/50 text-white text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              >
                <option value="all">Все категории</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Технология */}
              <select
                value={selectedTech}
                onChange={(e) => {
                  setSelectedTech(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-900/50 text-white text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              >
                <option value="all">Все технологии</option>
                {technologies.map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>

              {/* Сортировка по дате */}
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as 'newest' | 'oldest');
                  setPage(1);
                }}
                className="px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-900/50 text-white text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
              </select>

              {/* Кнопка сброса */}
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-900/50 border border-red-600 hover:border-red-700 disabled:border-gray-700 rounded-lg text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Сбросить
              </button>
                </div>
              </div>
            </div>
          </div>

          {/* Список проектов */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-6 border border-gray-700/50">
                <Search className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Проектов пока нет</h3>
              <p className="text-gray-400 mb-8">
                {hasActiveFilters ? 'Попробуйте изменить параметры поиска' : 'Скоро здесь появятся интересные проекты'}
              </p>
              {hasActiveFilters && (
                <Button variant="secondary" onClick={resetFilters}>
                  Сбросить фильтры
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Сетка проектов */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="group bg-gray-800/30 border border-gray-700/50 rounded-lg overflow-hidden hover:border-red-600 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-red-600/10 flex flex-col h-[480px]"
                  >
                    {/* Изображение */}
                    <div className="relative w-full h-48 flex-shrink-0 overflow-hidden bg-gray-900/50">
                      {project.thumbnail ? (
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Eye className="w-12 h-12" />
                        </div>
                      )}
                      {/* Дата создания */}
                      <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-gray-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>

                    {/* Контент */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Категория */}
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-red-600/10 text-red-400 rounded-full text-xs font-medium border border-red-600/20 inline-block">
                          {project.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm line-clamp-3 min-h-[4rem]">
                        {project.shortDescription}
                      </p>

                      {/* Кнопка */}
                      <div className="mt-auto">
                        <Link href={`/Projects/${project._id}`}>
                          <Button variant="secondary" size="default" className="w-full group">
                            <Eye className="w-4 h-4 mr-2" />
                            Посмотреть проект
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-3"
                >
                  <Button
                    variant="secondary"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Назад
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      if (totalPages <= 7) return i + 1;
                      if (page <= 4) return i + 1;
                      if (page >= totalPages - 3) return totalPages - 6 + i;
                      return page - 3 + i;
                    }).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          pageNum === page
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Вперёд
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
