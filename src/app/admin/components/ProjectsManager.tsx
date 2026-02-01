/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, X, Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '@/types/api';
import ProjectEditor from './ProjectEditor';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(false);

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

  const handleCreate = () => {
    setSelectedProject(null);
    setIsEditorOpen(true);
  };

  const handleEdit = async (id: string) => {
    setLoadingProject(true);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();

      if (data.success && data.data) {
        setSelectedProject(data.data as Project);
        setIsEditorOpen(true);
      } else {
        toast.error(data.error || 'Не удалось загрузить проект');
      }
    } catch (error) {
      console.error('Ошибка загрузки проекта:', error);
      toast.error('Ошибка при загрузке проекта');
    } finally {
      setLoadingProject(false);
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
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
        <div className="space-y-4">
          {/* Первая строка: Кнопка создания + Поиск */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-lg shadow-red-600/20 font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Создать проект
            </button>

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
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:border-gray-600 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-white line-clamp-1">
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
                    <button
                      onClick={() => handleEdit(project._id)}
                      disabled={loadingProject}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white hover:text-white hover:bg-gray-800/70 rounded-lg transition-colors border border-gray-600/50 hover:border-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors border border-red-600/30 hover:border-red-600/50"
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
        <div className="text-center py-12 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl">
          <p className="text-gray-400">Проекты не найдены</p>
        </div>
      )}

      {/* Project Editor Modal */}
      {isEditorOpen && (
        <ProjectEditor
          project={selectedProject}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedProject(null);
          }}
          onSave={() => {
            fetchProjects();
            setIsEditorOpen(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
}
