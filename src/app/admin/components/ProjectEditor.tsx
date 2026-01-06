/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { X, Upload, Trash2, ChevronLeft, ChevronRight, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { TECHNOLOGY_NAMES } from '@/lib/technologies';

interface ProjectData {
  _id?: string;
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
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  completedAt?: string;
  clientName?: string;
  projectDuration?: string;
  challenges?: string;
  results?: string;
  viewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectEditorProps {
  project?: ProjectData | null;
  onClose: () => void;
  onSave: () => void;
}

const CATEGORIES = ['Web', 'Mobile', 'Desktop', 'Design', 'AI/ML', 'Другое'];

const STEPS = [
  { id: 1, name: 'Основная информация', description: 'Название, категория, статус' },
  { id: 2, name: 'Описание', description: 'Описания и функционал' },
  { id: 3, name: 'Медиа', description: 'Изображения проекта' },
  { id: 4, name: 'Дополнительно', description: 'Технологии, ссылки' },
];

const ProjectEditor: React.FC<ProjectEditorProps> = ({ onClose, project, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProjectData>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    functionality: '',
    thumbnail: '',
    images: [],
    technologies: [],
    category: 'Web',
    githubUrl: '',
    demoUrl: '',
    status: 'draft',
    featured: false,
    completedAt: '',
    clientName: '',
    projectDuration: '',
    challenges: '',
    results: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        _id: project._id,
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        functionality: project.functionality || '',
        thumbnail: project.thumbnail || '',
        images: project.images || [],
        technologies: project.technologies || [],
        category: project.category || 'Web',
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        status: project.status || 'draft',
        featured: project.featured || false,
        completedAt: project.completedAt ? new Date(project.completedAt).toISOString().split('T')[0] : '',
        clientName: project.clientName || '',
        projectDuration: project.projectDuration || '',
        challenges: project.challenges || '',
        results: project.results || '',
      });
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        functionality: '',
        thumbnail: '',
        images: [],
        technologies: [],
        category: 'Web',
        githubUrl: '',
        demoUrl: '',
        status: 'draft',
        featured: false,
        completedAt: '',
        clientName: '',
        projectDuration: '',
        challenges: '',
        results: '',
      });
    }
    setCurrentStep(1);
  }, [project]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!validTypes.includes(file.type)) {
      toast.error('Недопустимый формат файла. Используйте JPEG, PNG, WebP или GIF.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('Размер файла не должен превышать 5MB.');
      return false;
    }

    return true;
  };

  const onThumbnailDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!validateFile(file)) return;

    try {
      const base64 = await convertToBase64(file);
      setFormData(prev => ({ ...prev, thumbnail: base64 }));
      toast.success('Главное изображение загружено');
    } catch (error) {
      toast.error('Ошибка загрузки изображения');
    }
  }, []);

  const onImagesDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    for (const file of acceptedFiles) {
      if (!validateFile(file)) continue;

      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, images: [...prev.images, base64] }));
      } catch (error) {
        toast.error(`Ошибка загрузки ${file.name}`);
      }
    }
    toast.success(`Загружено ${acceptedFiles.length} изображений`);
  }, []);

  const thumbnailDropzone = useDropzone({
    onDrop: onThumbnailDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
    multiple: false,
  });

  const imagesDropzone = useDropzone({
    onDrop: onImagesDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] },
    multiple: true,
  });

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.success('Изображение удалено');
  };

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    toast.success('Главное изображение удалено');
  };

  const toggleTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const handleSubmit = async (status?: 'draft' | 'published') => {
    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        status: status || formData.status,
      };
      
      const url = project ? `/api/projects/${project._id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        toast.success(project ? 'Проект обновлен' : 'Проект создан');
        onSave(); // Вызываем callback для обновления списка
        onClose();
      } else {
        toast.error('Ошибка сохранения проекта');
      }
    } catch (error) {
      toast.error('Ошибка сохранения проекта');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center flex-1">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep === step.id
                  ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/50'
                  : currentStep > step.id
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-600 bg-gray-800 text-gray-400'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </motion.div>
            <div className="mt-2 text-center">
              <p className={`text-xs font-medium ${currentStep === step.id ? 'text-red-500' : 'text-gray-400'}`}>
                {step.name}
              </p>
              <p className="text-[10px] text-gray-500 hidden sm:block">{step.description}</p>
            </div>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-all ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="title">Название проекта *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Мой потрясающий проект"
          maxLength={100}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.title || '').length}/100</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category">Категория *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="mt-2 w-full px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="status">Статус</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
            className="mt-2 w-full px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:border-red-500 focus:outline-none transition-all"
          >
            <option value="draft">Черновик</option>
            <option value="published">Опубликован</option>
            <option value="archived">Архив</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-xl border-2 border-gray-700">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
          className="w-5 h-5 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500 cursor-pointer"
        />
        <Label htmlFor="featured" className="cursor-pointer flex-1 mb-0">
          Избранный проект (отображать на главной странице)
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="completedAt">Дата завершения</Label>
          <Input
            type="date"
            id="completedAt"
            value={formData.completedAt}
            onChange={(e) => setFormData(prev => ({ ...prev, completedAt: e.target.value }))}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="projectDuration">Длительность проекта</Label>
          <Input
            id="projectDuration"
            value={formData.projectDuration || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, projectDuration: e.target.value }))}
            placeholder="2 месяца"
            maxLength={50}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="clientName">Название клиента</Label>
        <Input
          id="clientName"
          value={formData.clientName || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
          placeholder="ООО 'Компания'"
          maxLength={100}
          className="mt-2"
        />
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="shortDescription">Краткое описание *</Label>
        <Textarea
          id="shortDescription"
          value={formData.shortDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
          placeholder="Краткое описание проекта для карточки"
          maxLength={200}
          rows={3}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.shortDescription || '').length}/200</p>
      </div>

      <div>
        <Label htmlFor="fullDescription">Полное описание *</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
          placeholder="Подробное описание проекта, целей и задач..."
          maxLength={5000}
          rows={6}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.fullDescription || '').length}/5000</p>
      </div>

      <div>
        <Label htmlFor="functionality">Функционал *</Label>
        <Textarea
          id="functionality"
          value={formData.functionality}
          onChange={(e) => setFormData(prev => ({ ...prev, functionality: e.target.value }))}
          placeholder="Описание ключевого функционала проекта..."
          maxLength={5000}
          rows={6}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.functionality || '').length}/5000</p>
      </div>

      <div>
        <Label htmlFor="challenges">Вызовы и проблемы</Label>
        <Textarea
          id="challenges"
          value={formData.challenges || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
          placeholder="Какие технические вызовы были решены..."
          maxLength={2000}
          rows={4}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.challenges || '').length}/2000</p>
      </div>

      <div>
        <Label htmlFor="results">Результаты</Label>
        <Textarea
          id="results"
          value={formData.results || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
          placeholder="Достигнутые результаты и метрики..."
          maxLength={2000}
          rows={4}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">{(formData.results || '').length}/2000</p>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label>Главное изображение *</Label>
        {formData.thumbnail ? (
          <div className="mt-2 relative group">
            <img
              src={formData.thumbnail}
              alt="Thumbnail preview"
              className="w-full h-64 object-cover rounded-xl border-2 border-gray-700"
            />
            <button
              onClick={handleRemoveThumbnail}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            {...thumbnailDropzone.getRootProps()}
            className="mt-2 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-red-500 transition-all bg-gray-800/50 hover:bg-gray-800"
          >
            <input {...thumbnailDropzone.getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-1">Перетащите изображение или нажмите для выбора</p>
            <p className="text-xs text-gray-500">JPEG, PNG, WebP, GIF (макс. 5MB)</p>
          </div>
        )}
      </div>

      <div>
        <Label>Дополнительные изображения</Label>
        <div
          {...imagesDropzone.getRootProps()}
          className="mt-2 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-red-500 transition-all bg-gray-800/50 hover:bg-gray-800"
        >
          <input {...imagesDropzone.getInputProps()} />
          <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-300 mb-1">Перетащите изображения или нажмите для выбора</p>
          <p className="text-xs text-gray-500">Можно загрузить несколько файлов</p>
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Project image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-700"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label>Технологии * ({formData.technologies.length} выбрано)</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-800/50 rounded-xl border-2 border-gray-700">
          {TECHNOLOGY_NAMES.map(tech => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTechnology(tech)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.technologies.includes(tech)
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            placeholder="https://github.com/username/repo"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            id="demoUrl"
            value={formData.demoUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
            placeholder="https://example.com"
            className="mt-2"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-red-600/30 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-red-600/20">
              <h2 className="text-2xl font-bold text-white">
                {project ? 'Редактировать проект' : 'Создать новый проект'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="px-6 pt-6">
              {renderStepIndicator()}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && <div key="step1">{renderStep1()}</div>}
                {currentStep === 2 && <div key="step2">{renderStep2()}</div>}
                {currentStep === 3 && <div key="step3">{renderStep3()}</div>}
                {currentStep === 4 && <div key="step4">{renderStep4()}</div>}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-red-600/20 bg-black/50 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Назад
                </Button>

                <div className="flex gap-3">
                  {currentStep === STEPS.length && (
                    <>
                      <Button
                        onClick={() => handleSubmit('draft')}
                        disabled={isLoading}
                        variant="secondary"
                      >
                        Сохранить как черновик
                      </Button>
                      <Button
                        onClick={() => handleSubmit('published')}
                        disabled={isLoading}
                        variant="neon"
                      >
                        {isLoading ? 'Сохранение...' : project ? 'Обновить' : 'Создать'}
                      </Button>
                    </>
                  )}
                  {currentStep < STEPS.length && (
                    <Button
                      onClick={nextStep}
                      variant="neon"
                      className="flex items-center gap-2"
                    >
                      Далее
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
  );
};

export default ProjectEditor;
