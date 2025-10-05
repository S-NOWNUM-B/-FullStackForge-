'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

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
}

const categories = ['Web', 'Mobile', 'Desktop', 'Design', 'AI/ML', 'Другое'];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    functionality: '',
    category: 'Web',
    technologies: '',
    githubUrl: '',
    demoUrl: '',
  });
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль!');
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects?limit=100');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'thumbnail' | 'images') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'thumbnail') {
        setThumbnailPreview(base64);
      } else {
        setImagesPreview((prev) => [...prev, base64]);
      }
    };

    reader.readAsDataURL(file);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        functionality: project.functionality,
        category: project.category,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
      });
      setThumbnailPreview(project.thumbnail);
      setImagesPreview(project.images);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        functionality: '',
        category: 'Web',
        technologies: '',
        githubUrl: '',
        demoUrl: '',
      });
      setThumbnailPreview('');
      setImagesPreview([]);
    }
    setCurrentStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setCurrentStep(1);
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      functionality: '',
      category: 'Web',
      technologies: '',
      githubUrl: '',
      demoUrl: '',
    });
    setThumbnailPreview('');
    setImagesPreview([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверяем, что мы на шаге 3 (последний шаг)
    if (currentStep !== 3) {
      return;
    }

    // Валидация главного изображения
    if (!thumbnailPreview) {
      alert('⚠️ Пожалуйста, загрузите главное изображение проекта');
      return;
    }

    setLoading(true);

    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      thumbnail: thumbnailPreview,
      images: imagesPreview,
      ...(editingProject && { _id: editingProject._id }),
    };

    console.log('Отправка проекта:', projectData);

    try {
      const method = editingProject ? 'PUT' : 'POST';
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();
      console.log('Ответ сервера:', data);

      if (data.success) {
        alert(`✅ Проект ${editingProject ? 'обновлён' : 'создан'} успешно!`);
        closeModal();
        fetchProjects();
      } else {
        alert(`❌ Ошибка: ${data.error || data.message || 'Не удалось сохранить проект'}`);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('❌ Ошибка сети. Проверьте подключение и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });

      const data = await res.json();
      
      if (data.success) {
        alert('✅ Проект успешно удалён!');
        fetchProjects();
      } else {
        alert(`❌ Ошибка: ${data.error || data.message || 'Не удалось удалить проект'}`);
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      alert('❌ Ошибка сети. Проверьте подключение и попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(3, prev + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-semibold mb-6 text-white">Админ-панель</h1>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-4 text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            Войти
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-semibold text-white">Управление проектами</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg shadow-red-600/25"
          >
            <Plus size={20} />
            Создать проект
          </button>
        </div>

        {loading && !showModal ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Пока нет проектов</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex items-center gap-6 hover:border-gray-700 transition-colors"
              >
                <div className="relative w-32 h-32 bg-gray-800 rounded flex-shrink-0 overflow-hidden">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-red-600/10 text-red-400 rounded text-xs font-medium border border-red-600/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(project)}
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Компактное модальное окно с шагами */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Заголовок */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">
                      {editingProject ? 'Редактировать' : 'Создать'} проект
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Шаг {currentStep} из 3</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                {/* Индикатор шагов */}
                <div className="flex gap-2 px-6 pt-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 h-1 rounded-full transition-colors ${
                        step <= currentStep ? 'bg-red-600' : 'bg-gray-800'
                      }`}
                    />
                  ))}
                </div>

                {/* Контент */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Шаг 1: Основная информация */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Название проекта *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            placeholder="Мой крутой проект"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Категория *
                          </label>
                          <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Краткое описание * (до 200 символов)
                          </label>
                          <textarea
                            required
                            maxLength={200}
                            value={formData.shortDescription}
                            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none h-24 resize-none"
                            placeholder="Краткое описание проекта для карточки"
                          />
                          <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/200</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Технологии * (через запятую)
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.technologies}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            placeholder="React, TypeScript, Node.js, MongoDB"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Шаг 2: Детальное описание */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Полное описание *
                          </label>
                          <textarea
                            required
                            maxLength={3000}
                            value={formData.fullDescription}
                            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none h-40 resize-none"
                            placeholder="Подробное описание проекта, целей, задач..."
                          />
                          <p className="text-xs text-gray-500 mt-1">{formData.fullDescription.length}/3000</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Функционал
                          </label>
                          <textarea
                            maxLength={3000}
                            value={formData.functionality}
                            onChange={(e) => setFormData({ ...formData, functionality: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none h-32 resize-none"
                            placeholder="Основной функционал проекта..."
                          />
                          <p className="text-xs text-gray-500 mt-1">{formData.functionality.length}/3000</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            GitHub URL
                          </label>
                          <input
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            placeholder="https://github.com/..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Demo URL
                          </label>
                          <input
                            type="url"
                            value={formData.demoUrl}
                            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                            placeholder="https://demo.example.com/..."
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Шаг 3: Изображения */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Главное изображение <span className="text-red-400 font-semibold">*</span>
                          </label>
                          <p className="text-xs text-gray-500 mb-3">Это изображение будет отображаться на странице проектов</p>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors text-white border border-gray-700">
                              <Upload size={20} />
                              Загрузить
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'thumbnail')}
                                className="hidden"
                              />
                            </label>
                            {thumbnailPreview && (
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-red-600">
                                <Image src={thumbnailPreview} alt="Preview" fill className="object-cover" />
                              </div>
                            )}
                          </div>
                          {!thumbnailPreview && (
                            <p className="text-xs text-red-400 mt-2">⚠️ Обязательно загрузите главное изображение</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Дополнительные изображения
                          </label>
                          <p className="text-xs text-gray-500 mb-3">Эти изображения будут отображаться в галерее проекта (необязательно)</p>
                          <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors text-white border border-gray-700 mb-4">
                            <Plus size={20} />
                            Добавить изображение
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, 'images')}
                              className="hidden"
                            />
                          </label>
                          {imagesPreview.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                              {imagesPreview.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700">
                                  <Image src={img} alt={`Preview ${index}`} fill className="object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setImagesPreview((prev) => prev.filter((_, i) => i !== index))}
                                    className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Кнопки навигации */}
                  <div className="flex gap-3 p-6 border-t border-gray-800 bg-gray-900/50">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Назад
                      </button>
                    )}
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                      >
                        Далее
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Сохранение...
                          </>
                        ) : (
                          'Сохранить проект'
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
