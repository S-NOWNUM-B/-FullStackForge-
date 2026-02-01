/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, X, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import type { Project } from '@/types/api';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const res = await fetch('/api/projects/filters');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        setTechnologies(data.technologies || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки фильтров:', error);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?limit=100&showAll=true');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
      toast.error('Не удалось загрузить проекты');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот проект?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Проект удален');
        fetchProjects();
      } else {
        toast.error('Не удалось удалить проект');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Ошибка при удалении');
    }
  };


  const filteredProjects = (projects || [])
    .filter(p => {
      // Фильтр по поиску
      if (search) {
        const searchLower = search.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(searchLower);
        const matchDesc = p.shortDescription.toLowerCase().includes(searchLower);
        const matchTech = p.technologies.some(t => t.toLowerCase().includes(searchLower));
        if (!matchTitle && !matchDesc && !matchTech) return false;
      }
      
      // Фильтр по категории
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      
      // Фильтр по технологии
      if (selectedTech !== 'all' && !p.technologies.includes(selectedTech)) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Сортировка по дате
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedTech('all');
    setSortOrder('newest');
  };

  const hasActiveFilters = search !== '' || selectedCategory !== 'all' || selectedTech !== 'all' || sortOrder !== 'newest';

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
        <div className="space-y-4">
          {/* Первая строка: Кнопка создания + Поиск */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/admin/projects/new">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg transition-all shadow-lg shadow-red-600/20 font-medium whitespace-nowrap transform duration-200">
                <Plus className="w-5 h-5" />
                Создать проект
              </button>
            </Link>

            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              onChange={(e) => setSelectedTech(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-gray-700 bg-gray-900/50 text-white text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20"
            >
              <option value="all">Все технологии</option>
              {technologies.map((tech) => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>

            {/* Сортировка */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
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

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-700/50 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-700/50 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-700/50 rounded animate-pulse w-2/3" />
                <div className="pt-4 grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-700/50 rounded animate-pulse" />
                  <div className="h-10 bg-gray-700/50 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="group bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-600/10 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-white line-clamp-1 group-hover:text-red-400 transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex-1 text-right">
                      {new Date(project.createdAt).toLocaleDateString('ru')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-700/50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Link href={`/admin/projects/${project._id}/edit`}>
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-600/70 active:scale-95 rounded-lg transition-all border border-gray-600 hover:border-gray-500 transform duration-200 shadow-md hover:shadow-lg">
                        <Pencil className="w-4 h-4" />
                        Редактировать
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 active:scale-95 rounded-lg transition-all border border-red-600/30 hover:border-red-600/50 transform duration-200 shadow-md hover:shadow-lg hover:shadow-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {filteredProjects.length === 0 && !loading && (
        <div className="col-span-full">
          <div className="text-center py-16 bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Проекты не найдены</h3>
            <p className="text-gray-500 mb-6">Попробуйте изменить фильтры или создайте новый проект</p>
          </div>
        </div>
      )}
    </div>
  );
}
