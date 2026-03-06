import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Plus,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Technology,
  ProcessStep,
  ResultMetric,
  GalleryImage,
} from "@/types/api";

interface ProjectData {
  _id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  functionality: string;
  thumbnail: string;
  gallery?: GalleryImage[];
  processSteps?: ProcessStep[];
  resultMetrics?: ResultMetric[];
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  status: "draft" | "published";
  featured: boolean;
  startedAt?: string;
  completedAt?: string;
  clientName?: string;
  challenges?: string;
  results?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectEditorProps {
  project?: ProjectData | null;
  onSave: () => void;
}

const CATEGORIES = ["Web", "Mobile", "Desktop", "Design", "AI/ML", "Другое"];

const STEPS = [
  {
    id: 1,
    name: "Основная информация",
    description: "Название, категория, клиент",
  },
  { id: 2, name: "Описание", description: "Описания проекта" },
  { id: 3, name: "Медиа", description: "Главное изображение проекта" },
  { id: 4, name: "Процесс разработки", description: "Timeline этапов" },
  { id: 5, name: "Результаты", description: "Метрики и результаты" },
  { id: 6, name: "Технологии", description: "Технологии и ссылки" },
];

import { ImageUpload } from "./ImageUpload";
import { GalleryUpload } from "./GalleryUpload";

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTechLoading, setIsTechLoading] = useState(true);
  const [availableTechs, setAvailableTechs] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState<ProjectData>(() => {
    if (project) {
      return {
        _id: project._id,
        title: project.title || "",
        shortDescription: project.shortDescription || "",
        fullDescription: project.fullDescription || "",
        functionality: project.functionality || "",
        thumbnail: project.thumbnail || "",
        gallery: Array.isArray(project.gallery) ? project.gallery : [],
        processSteps: project.processSteps || [],
        resultMetrics: project.resultMetrics || [],
        technologies: project.technologies || [],
        category: project.category || "Web",
        githubUrl: project.githubUrl || "",
        demoUrl: project.demoUrl || "",
        status: project.status || "draft",
        featured: project.featured || false,
        startedAt: project.startedAt
          ? new Date(project.startedAt).toISOString().split("T")[0]
          : "",
        completedAt: project.completedAt
          ? new Date(project.completedAt).toISOString().split("T")[0]
          : "",
        clientName: project.clientName || "",
        challenges: project.challenges || "",
        results: project.results || "",
      };
    }
    return {
      title: "",
      shortDescription: "",
      fullDescription: "",
      functionality: "",
      thumbnail: "",
      gallery: [],
      processSteps: [],
      resultMetrics: [],
      technologies: [],
      category: "Web",
      githubUrl: "",
      demoUrl: "",
      status: "published",
      featured: false,
      startedAt: "",
      completedAt: "",
      clientName: "",
      challenges: "",
      results: "",
    };
  });

  React.useEffect(() => {
    const fetchTechs = async () => {
      try {
        const res = await fetch("/api/technologies");
        const json = await res.json();
        if (json.success) {
          const projectTechs = json.data
            .filter((t: Technology) => t.isProjectTech)
            .map((t: Technology) => t.name);
          setAvailableTechs(projectTechs);
        }
      } catch (error) {
        console.error("Failed to fetch project technologies:", error);
      } finally {
        setIsTechLoading(false);
      }
    };
    fetchTechs();
  }, []);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...validationErrors };

    switch (field) {
      case "title":
        if (!value || value.trim().length === 0) {
          newErrors.title = "Название обязательно";
        } else if (value.length > 100) {
          newErrors.title = "Название не должно быть длиннее 100 символов";
        } else {
          delete newErrors.title;
        }
        break;
      case "shortDescription":
        if (!value || value.trim().length === 0) {
          newErrors.shortDescription = "Краткое описание обязательно";
        } else if (value.length > 200) {
          newErrors.shortDescription = "Максимум 200 символов";
        } else {
          delete newErrors.shortDescription;
        }
        break;
      case "category":
        if (!value) {
          newErrors.category = "Выберите категорию";
        } else {
          delete newErrors.category;
        }
        break;
    }

    setValidationErrors(newErrors);
  };

  const handleUploadThumbnail = (url: string) => {
    setFormData((prev) => ({ ...prev, thumbnail: url }));
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  };

  const toggleTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech],
    }));
  };

  const addProcessStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      title: "",
      description: "",
      status: "completed",
    };
    setFormData((prev) => ({
      ...prev,
      processSteps: [...(prev.processSteps || []), newStep],
    }));
  };

  const removeProcessStep = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      processSteps: (prev.processSteps || []).filter((s) => s.id !== id),
    }));
  };

  const updateProcessStep = (
    id: string,
    field: keyof ProcessStep,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      processSteps: (prev.processSteps || []).map((s) =>
        s.id === id ? { ...s, [field]: value } : s,
      ),
    }));
  };

  const addResultMetric = () => {
    const newMetric: ResultMetric = {
      id: Date.now().toString(),
      label: "",
      value: "",
      type: "percentage",
    };
    setFormData((prev) => ({
      ...prev,
      resultMetrics: [...(prev.resultMetrics || []), newMetric],
    }));
  };

  const removeResultMetric = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      resultMetrics: (prev.resultMetrics || []).filter((m) => m.id !== id),
    }));
  };

  const updateResultMetric = (
    id: string,
    field: keyof ResultMetric,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      resultMetrics: (prev.resultMetrics || []).map((m) =>
        m.id === id ? { ...m, [field]: value } : m,
      ),
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const dataToSave: Record<string, unknown> = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        functionality: formData.functionality,
        thumbnail: formData.thumbnail,
        gallery: formData.gallery || [],
        processSteps: formData.processSteps || [],
        resultMetrics: formData.resultMetrics || [],
        technologies: formData.technologies,
        category: formData.category,
        githubUrl: formData.githubUrl || "",
        demoUrl: formData.demoUrl || "",
        status: formData.status,
        featured: formData.featured,
        clientName: formData.clientName || "",
        challenges: formData.challenges || "",
        results: formData.results || "",
      };

      if (formData.startedAt) {
        dataToSave.startedAt = new Date(formData.startedAt).toISOString();
      }
      if (formData.completedAt) {
        dataToSave.completedAt = new Date(formData.completedAt).toISOString();
      }

      if (project) {
        dataToSave._id = project._id;
      }

      const url = project ? `/api/projects/${project._id}` : "/api/projects";
      const method = project ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        toast.success(project ? "Проект обновлен" : "Проект создан");
        onSave();
      } else {
        const error = await res.json();
        toast.error(error.error || "Ошибка сохранения проекта");
      }
    } catch {
      toast.error("Ошибка сохранения проекта");
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
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center flex-1 min-w-max px-2">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep === step.id
                  ? "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/50"
                  : currentStep > step.id
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-600 bg-gray-800 text-gray-400"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
            </motion.div>
            <div className="mt-2 text-center">
              <p
                className={`text-xs font-medium ${currentStep === step.id ? "text-red-500" : "text-gray-400"}`}
              >
                {step.name}
              </p>
              <p className="text-[10px] text-gray-500 hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-all ${
                currentStep > step.id ? "bg-green-500" : "bg-gray-700"
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
              setFormData((prev) => ({ ...prev, title: e.target.value }));
              validateField("title", e.target.value);
            }}
            placeholder="Мой потрясающий проект"
            maxLength={100}
            className={`mt-2 ${validationErrors.title ? "border-red-500 focus:border-red-500" : ""}`}
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
        <p className="text-xs text-gray-500 mt-1">
          {(formData.title || "").length}/100
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="category">Категория *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, category: e.target.value }));
              validateField("category", e.target.value);
            }}
            className={`mt-2 w-full px-4 py-2 bg-gray-800 border-2 rounded-lg text-white focus:border-red-500 focus:outline-none transition-all ${validationErrors.category ? "border-red-500" : "border-gray-700"}`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {validationErrors.category && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors.category}
            </p>
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
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startedAt: e.target.value }))
            }
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="completedAt">Дата завершения</Label>
          <Input
            type="date"
            id="completedAt"
            value={formData.completedAt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, completedAt: e.target.value }))
            }
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="clientName">Название клиента</Label>
        <Input
          id="clientName"
          value={formData.clientName || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, clientName: e.target.value }))
          }
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
              setFormData((prev) => ({
                ...prev,
                shortDescription: e.target.value,
              }));
              validateField("shortDescription", e.target.value);
            }}
            placeholder="Краткое описание проекта"
            maxLength={200}
            rows={3}
            className={`mt-2 ${validationErrors.shortDescription ? "border-red-500 focus:border-red-500" : ""}`}
          />
        </div>
        {validationErrors.shortDescription && (
          <p className="text-xs text-red-500 mt-1">
            {validationErrors.shortDescription}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {(formData.shortDescription || "").length}/200
        </p>
      </div>

      <div>
        <Label htmlFor="fullDescription">Полное описание</Label>
        <Textarea
          id="fullDescription"
          value={formData.fullDescription}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              fullDescription: e.target.value,
            }))
          }
          placeholder="Подробное описание проекта..."
          maxLength={5000}
          rows={6}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.fullDescription || "").length}/5000
        </p>
      </div>

      <div>
        <Label htmlFor="functionality">Функционал</Label>
        <Textarea
          id="functionality"
          value={formData.functionality}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, functionality: e.target.value }))
          }
          placeholder="Описание ключевого функционала..."
          maxLength={5000}
          rows={6}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          {(formData.functionality || "").length}/5000
        </p>
      </div>

      <div>
        <Label htmlFor="challenges">Вызовы и проблемы</Label>
        <Textarea
          id="challenges"
          value={formData.challenges || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, challenges: e.target.value }))
          }
          placeholder="Какие технические вызовы были решены..."
          maxLength={2000}
          rows={4}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="results">Результаты и итоги</Label>
        <Textarea
          id="results"
          value={formData.results || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, results: e.target.value }))
          }
          placeholder="Достигнутые результаты..."
          maxLength={2000}
          rows={4}
          className="mt-2"
        />
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <ImageUpload
          label="Главное изображение проекта *"
          value={formData.thumbnail}
          onUpload={handleUploadThumbnail}
          onRemove={handleRemoveThumbnail}
          folder="projects/thumbnails"
        />
      </div>

      <div className="pt-6 border-t border-gray-800">
        <Label className="text-lg font-semibold text-white mb-4 block">
          Галерея проекта
        </Label>
        <p className="text-sm text-gray-400 mb-6">
          Загрузите дополнительные скриншоты или изображения процесса
          разработки.
        </p>
        <GalleryUpload
          images={formData.gallery || []}
          onChange={(gallery) => setFormData((prev) => ({ ...prev, gallery }))}
          folder="projects/galleries"
        />
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
      <div className="flex items-center justify-between">
        <Label className="text-base">Этапы разработки</Label>
        <button
          onClick={addProcessStep}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Добавить этап
        </button>
      </div>
      {formData.processSteps && formData.processSteps.length > 0 ? (
        <div className="space-y-4">
          {formData.processSteps.map((step) => (
            <div
              key={step.id}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label className="text-xs">Название этапа</Label>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        updateProcessStep(step.id, "title", e.target.value)
                      }
                      placeholder="Например: Дизайн UI/UX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Описание</Label>
                    <Textarea
                      value={step.description}
                      onChange={(e) =>
                        updateProcessStep(
                          step.id,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Что было сделано на этом этапе..."
                      maxLength={500}
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Дата начала</Label>
                      <Input
                        type="date"
                        value={step.startDate || ""}
                        onChange={(e) =>
                          updateProcessStep(
                            step.id,
                            "startDate",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Дата завершения</Label>
                      <Input
                        type="date"
                        value={step.endDate || ""}
                        onChange={(e) =>
                          updateProcessStep(step.id, "endDate", e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeProcessStep(step.id)}
                  className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Этапы еще не добавлены</p>
        </div>
      )}
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Label className="text-base">Метрики результатов</Label>
        <button
          onClick={addResultMetric}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Добавить метрику
        </button>
      </div>

      {formData.resultMetrics && formData.resultMetrics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.resultMetrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
            >
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Название метрики</Label>
                  <Input
                    value={metric.label}
                    onChange={(e) =>
                      updateResultMetric(metric.id, "label", e.target.value)
                    }
                    placeholder="Например: Увеличение трафика"
                    maxLength={50}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Значение</Label>
                    <Input
                      value={metric.value}
                      onChange={(e) =>
                        updateResultMetric(metric.id, "value", e.target.value)
                      }
                      placeholder="300"
                      maxLength={50}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Тип</Label>
                    <select
                      value={metric.type || "percentage"}
                      onChange={(e) =>
                        updateResultMetric(metric.id, "type", e.target.value)
                      }
                      className="mt-1 w-full px-3 py-2 bg-gray-700 rounded text-xs text-white border border-gray-600"
                    >
                      <option value="percentage">%</option>
                      <option value="number">Число</option>
                      <option value="time">Время</option>
                      <option value="currency">Сумма</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => removeResultMetric(metric.id)}
                  className="w-full p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-all text-xs"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Метрики еще не добавлены</p>
        </div>
      )}
    </motion.div>
  );

  const renderStep6 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <Label>Технологии * ({formData.technologies.length} выбрано)</Label>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-800/50 rounded-xl border-2 border-gray-700">
          {isTechLoading ? (
            <div className="col-span-full py-4 text-center text-gray-500 text-sm">
              Загрузка технологий...
            </div>
          ) : availableTechs.length > 0 ? (
            availableTechs.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTechnology(tech)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.technologies.includes(tech)
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-transparent"
                }`}
              >
                {tech}
              </button>
            ))
          ) : (
            <div className="col-span-full py-4 text-center text-gray-500 text-sm">
              Нет доступных технологий
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
            placeholder="https://github.com/username/repo"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            id="demoUrl"
            value={formData.demoUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))
            }
            placeholder="https://example.com"
            className="mt-2"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      <div className="w-full overflow-visible flex flex-col">
        {/* Step Indicator */}
        <div className="pt-2 shrink-0">{renderStepIndicator()}</div>

        {/* Content */}
        <div className="flex-1 py-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <div key="step1">{renderStep1()}</div>}
            {currentStep === 2 && <div key="step2">{renderStep2()}</div>}
            {currentStep === 3 && <div key="step3">{renderStep3()}</div>}
            {currentStep === 4 && <div key="step4">{renderStep4()}</div>}
            {currentStep === 5 && <div key="step5">{renderStep5()}</div>}
            {currentStep === 6 && <div key="step6">{renderStep6()}</div>}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="py-6 border-t border-red-600/10 shrink-0">
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
                <Button
                  onClick={() => handleSubmit()}
                  disabled={
                    isLoading || Object.keys(validationErrors).length > 0
                  }
                  variant="neon"
                >
                  {isLoading
                    ? "Сохранение..."
                    : project
                      ? "Обновить"
                      : "Создать"}
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
      </div>
    </div>
  );
};

export default ProjectEditor;
