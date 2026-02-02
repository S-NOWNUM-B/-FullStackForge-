/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { X, Upload, Trash2, ChevronLeft, ChevronRight, Check, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { PROJECT_TECHNOLOGY_NAMES } from '@/constants/project-technologies';

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
  status: 'draft' | 'published';
  featured: boolean;
  startedAt?: string;
  completedAt?: string;
  clientName?: string;
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
  { id: 1, name: 'Основная информация', description: 'Название, категория, название клиента' },
  { id: 2, name: 'Описание', description: 'Описания и функционал' },
  { id: 3, name: 'Медиа', description: 'Изображения проекта' },
  { id: 4, name: 'Дополнительно', description: 'Технологии, ссылки' },
];

const ProjectEditor: React.FC<ProjectEditorProps> = ({ onClose, project, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const [formData, setFormData] = useState<ProjectData>(() => {
    if (project) {
      return {
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
        startedAt: project.startedAt ? new Date(project.startedAt).toISOString().split('T')[0] : '',
        completedAt: project.completedAt ? new Date(project.completedAt).toISOString().split('T')[0] : '',
        clientName: project.clientName || '',
        challenges: project.challenges || '',
        results: project.results || '',
      };
    }
    return {
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
      status: 'published',
      featured: false,
      startedAt: '',
      completedAt: '',
      clientName: '',
      challenges: '',
      results: '',
    };
  });

  // Auto-save draft каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.title && formData.shortDescription) {
        setAutoSaveStatus('saving');
        setTimeout(() => setAutoSaveStatus('saved'), 500);
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  // Real-time валидация
  const validateField = (field: string, value: string) => {
    const newErrors = { ...validationErrors };

    switch (field) {
      case 'title':
        if (!value || value.trim().length === 0) {
          newErrors.title = 'Название обязательно';
        } else if (value.length > 100) {
          newErrors.title = 'Название не должно быть длиннее 100 символов';
        } else {
          delete newErrors.title;
        }
        break;
      case 'shortDescription':
        if (!value || value.trim().length === 0) {
          newErrors.shortDescription = 'Краткое описание обязательно';
        } else if (value.length > 200) {
          newErrors.shortDescription = 'Максимум 200 символов';
        } else {
          delete newErrors.shortDescription;
        }
        break;
      case 'category':
        if (!value) {
          newErrors.category = 'Выберите категорию';
        } else {
          delete newErrors.category;
        }
        break;
    }

    setValidationErrors(newErrors);
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Не удалось получить контекст canvas'));
            return;
          }

          const width = img.width;
          const height = img.height;
          
          // Вычисляем размеры с агрессивным сжатием
          const quality = 0.7;
          const maxDimension = 1200;
          
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          const newWidth = Math.floor(width * ratio);
          const newHeight = Math.floor(height * ratio);
          
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          
          // Сжимаем в WebP с хорошим качеством
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Не удалось создать blob'));
                return;
              }
              
              const compressedFile = new File([blob], file.name, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              
              const originalSizeKB = (file.size / 1024).toFixed(1);
              const compressedSizeKB = (compressedFile.size / 1024).toFixed(1);
              
              console.log(`Сжатие: ${originalSizeKB}KB → ${compressedSizeKB}KB (${newWidth}x${newHeight})`);
              
              resolve(compressedFile);
            },
            'image/webp',
            quality
          );
        };
        
        img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
      };
      
      reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    });
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];

    if (!validTypes.includes(file.type)) {
      toast.error('Недопустимый формат файла. Используйте JPEG, PNG, WebP или GIF.');
      return false;
    }

    return true;
  };

  const onThumbnailDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!validateFile(file)) return;

    try {
      toast.loading('Загружаю изображение...', { id: 'upload-thumb' });
      
      // Сжимаем перед загрузкой
      const compressedFile = await compressImage(file);
      
      // Конвертируем в base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, thumbnail: base64 }));
        toast.success('Главное изображение загружено!', { id: 'upload-thumb' });
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка загрузки изображения', { id: 'upload-thumb' });
    }
  }, []);

  const onImagesDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const validFiles = acceptedFiles.filter(validateFile);
    if (validFiles.length === 0) return;

    try {
      toast.loading(`Загружаю ${validFiles.length} изображений...`, { id: 'upload-images' });
      
      // Сжимаем все изображения перед загрузкой
      const compressedFiles = await Promise.all(
        validFiles.map(file => compressImage(file))
      );
      
      // Конвертируем в base64
      const newImages: string[] = [];
      let processedCount = 0;
      
      const processFile = (file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      };
      
      for (const file of compressedFiles) {
        const base64 = await processFile(file);
        newImages.push(base64);
        processedCount++;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...newImages] 
      }));
      toast.success(`Загружено ${processedCount} изображений!`, { id: 'upload-images' });
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка загрузки изображений', { id: 'upload-images' });
    }
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Подготавливаем данные для сохранения
      const dataToSave: Record<string, unknown> = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        functionality: formData.functionality,
        thumbnail: formData.thumbnail,
        images: formData.images,
        technologies: formData.technologies,
        category: formData.category,
        githubUrl: formData.githubUrl || '',
        demoUrl: formData.demoUrl || '',
        status: formData.status,
        featured: formData.featured,
        clientName: formData.clientName || '',
        challenges: formData.challenges || '',
        results: formData.results || '',
      };

      // Преобразуем даты в ISO формат если они заполнены
      if (formData.startedAt) {
        dataToSave.startedAt = new Date(formData.startedAt).toISOString();
      }
      if (formData.completedAt) {
        dataToSave.completedAt = new Date(formData.completedAt).toISOString();
      }
      
      // Для обновления добавляем _id
      if (project) {
        dataToSave._id = project._id;
      }
      
      // Проверяем размер документа перед отправкой
      const documentSizeBytes = new Blob([JSON.stringify(dataToSave)]).size;
      const documentSizeMB = (documentSizeBytes / 1024 / 1024).toFixed(2);
      
      // Лимит Firestore - 1MB
      if (documentSizeBytes > 900 * 1024) {
        const imagesToRemove = Math.ceil((documentSizeBytes - 900 * 1024) / 50000); // Примерный расчет
        toast.error(
          `Размер документа ${documentSizeMB}MB превышает лимит. Уменьшите количество изображений на ${imagesToRemove}.`
        );
        setIsLoading(false);
        return;
      }
      
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
        const error = await res.json();
        toast.error(error.error || 'Ошибка сохранения проекта');
      }
    } catch {
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
        <div className="relative">
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              validateField('title', e.target.value);
            }}
            placeholder="Мой потрясающий проект"
            maxLength={100}
            className={`mt-2 ${validationErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
          />
          {validationErrors.title && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 mt-1">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>
        {validationErrors.title && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.title}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">{(formData.title || '').length}/100</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category">Категория *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, category: e.target.value }));
              validateField('category', e.target.value);
            }}
            className={`mt-2 w-full px-4 py-2 bg-gray-800 border-2 rounded-lg text-white focus:border-red-500 focus:outline-none transition-all ${validationErrors.category ? 'border-red-500' : 'border-gray-700'}`}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {validationErrors.category && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.category}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="startedAt">Дата начала</Label>
          <Input
            type="date"
            id="startedAt"
            value={formData.startedAt}
            onChange={(e) => setFormData(prev => ({ ...prev, startedAt: e.target.value }))}
            className="mt-2"
          />
        </div>

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
        <div className="relative">
          <Textarea
            id="shortDescription"
            value={formData.shortDescription}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, shortDescription: e.target.value }));
              validateField('shortDescription', e.target.value);
            }}
            placeholder="Краткое описание проекта для карточки"
            maxLength={200}
            rows={3}
            className={`mt-2 ${validationErrors.shortDescription ? 'border-red-500 focus:border-red-500' : ''}`}
          />
        </div>
        {validationErrors.shortDescription && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.shortDescription}</p>
        )}
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
          {PROJECT_TECHNOLOGY_NAMES.map(tech => (
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
      className="w-full"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-linear-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-red-600/30 w-full overflow-visible flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-600/20">
          <h2 className="text-lg font-bold text-white">
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
            <div className="flex items-center gap-2">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </Button>
              
              {/* Document Size Indicator */}
              {(() => {
                const dataToCheck = {
                  title: formData.title,
                  shortDescription: formData.shortDescription,
                  fullDescription: formData.fullDescription,
                  functionality: formData.functionality,
                  thumbnail: formData.thumbnail,
                  images: formData.images,
                  technologies: formData.technologies,
                  category: formData.category,
                };
                const docSizeBytes = new Blob([JSON.stringify(dataToCheck)]).size;
                const docSizeMB = (docSizeBytes / 1024 / 1024).toFixed(2);
                const percentUsed = Math.round((docSizeBytes / (1024 * 1024)) * 100);
                const isWarning = docSizeBytes > 800 * 1024;
                const isError = docSizeBytes > 900 * 1024;
                
                return (
                  <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                    isError 
                      ? 'bg-red-900/50 text-red-400' 
                      : isWarning 
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : 'bg-gray-800/50 text-gray-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <span>{docSizeMB}MB ({percentUsed}%)</span>
                  </div>
                );
              })()}
              
              {/* Images Count */}
              {formData.images.length > 0 || formData.thumbnail ? (
                <div className="flex items-center gap-2 text-xs">
                  <ImageIcon className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-gray-400">
                    {formData.thumbnail ? '1 главное' : ''}{formData.thumbnail && formData.images.length > 0 ? ' + ' : ''}{formData.images.length > 0 ? `${formData.images.length} доп.` : ''}
                  </span>
                </div>
              ) : null}
              
              {/* Auto-save status */}
              {autoSaveStatus !== 'idle' && (
                <div className="flex items-center gap-2 text-xs">
                  {autoSaveStatus === 'saving' && (
                    <>
                      <div className="animate-spin w-3 h-3 border border-gray-500 border-t-gray-300 rounded-full" />
                      <span className="text-gray-400">Сохраняю...</span>
                    </>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Сохранено</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep === STEPS.length && (
                <Button
                  onClick={() => handleSubmit()}
                  disabled={isLoading || Object.keys(validationErrors).length > 0}
                  variant="neon"
                >
                  {isLoading ? 'Сохранение...' : project ? 'Обновить' : 'Создать'}
                </Button>
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
