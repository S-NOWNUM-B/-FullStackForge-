/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Star, Archive, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '@/types/api';
import ProjectEditor from './ProjectEditor';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views'>('date');

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleEdit = (project: Project) => {
    console.log('[ProjectsManager] handleEdit called with project:', project);
    setEditingProject(project);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowEditor(true);
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

  const handleStatusChange = async (project: Project, newStatus: 'draft' | 'published') => {
    if (!project) return;
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: project._id, status: newStatus }),
      });

      if (res.ok) {
        toast.success('Статус обновлен');
        fetchProjects();
      } else {
        toast.error('Не удалось обновить статус');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      toast.error('Ошибка при обновлении');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    if (!project) return;
    try {
      const newFeaturedStatus = !project.featured;
      const res = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: project._id, featured: newFeaturedStatus }),
      });

      if (res.ok) {
        toast.success(newFeaturedStatus ? 'Добавлено в избранное' : 'Убрано из избранного');
        fetchProjects();
      } else {
        toast.error('Не удалось обновить');
      }
    } catch (error) {
      console.error('Ошибка обновления:', error);
      toast.error('Ошибка при обновлении');
    }
  };

  const filteredProjects = (projects || [])
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    draft: projects.filter(p => p.status === 'draft').length,
    featured: projects.filter(p => p.featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Всего проектов</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
          <div className="text-3xl font-bold text-white">{stats.published}</div>
          <div className="text-sm text-gray-400">Опубликовано</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
          <div className="text-3xl font-bold text-white">{stats.draft}</div>
          <div className="text-sm text-gray-400">Черновики</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
          <div className="text-3xl font-bold text-white">{stats.featured}</div>
          <div className="text-sm text-gray-400">Избранные</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-lg shadow-red-600/20"
            >
              <Plus className="w-4 h-4" />
              Создать проект
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
              className="px-3 py-2 rounded-lg border border-gray-700/50 bg-gray-800/40 backdrop-blur-sm text-gray-300 text-sm focus:border-gray-600 focus:outline-none"
            >
              <option value="all">Все статусы</option>
              <option value="published">Опубликованные</option>
              <option value="draft">Черновики</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'views')}
              className="px-3 py-2 rounded-lg border border-gray-700/50 bg-gray-800/40 backdrop-blur-sm text-gray-300 text-sm focus:border-gray-600 focus:outline-none"
            >
              <option value="date">По дате</option>
              <option value="views">По просмотрам</option>
            </select>
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
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl overflow-hidden hover:border-gray-600 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-500/90 backdrop-blur-sm text-white text-xs font-bold rounded">
                        <Star className="w-3 h-3 inline" />
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-bold rounded backdrop-blur-sm ${
                      project.status === 'published' ? 'bg-green-500/90 text-white' :
                      'bg-yellow-500/90 text-white'
                    }`}>
                      {project.status === 'published' ? 'Опубликован' : 'Черновик'}
                    </span>
                  </div>
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
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {project.viewsCount || 0}
                    </span>
                    <span className="flex-1 text-right">
                      {new Date(project.createdAt).toLocaleDateString('ru')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-700/50">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors border border-gray-700/50 hover:border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors border ${
                        project.featured 
                          ? 'text-yellow-400 bg-yellow-900/30 border-yellow-600/30' 
                          : 'text-gray-400 hover:bg-gray-700/30 border-gray-700/30'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                    </button>
                    {project.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(project, 'published')}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-green-400 hover:bg-green-900/30 rounded-lg transition-colors border border-green-600/30"
                        title="Опубликовать"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {project.status === 'published' && (
                      <button
                        onClick={() => handleStatusChange(project, 'draft')}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors border border-yellow-600/30"
                        title="В черновики"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-900/30 rounded-lg transition-colors border border-red-600/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm rounded-xl">
          <p className="text-gray-400">
            {filterStatus === 'all' ? 'Нет проектов' : 'Нет проектов с таким статусом'}
          </p>
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <ProjectEditor
            project={editingProject}
            onClose={() => {
              setShowEditor(false);
              setEditingProject(null);
            }}
            onSave={() => {
              setShowEditor(false);
              setEditingProject(null);
              fetchProjects();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
