"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Settings2,
  Trash2,
  Edit2,
  X,
  Eye,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { Technology } from "@/types/api";
import { getIconByName } from "@/utils/getIcon";

const DEFAULT_TECH_COLOR = "#6b7280";
const DEFAULT_TECH_ICON = "FaCode";

const createDefaultTechnology = (order: number): Partial<Technology> => ({
  name: "",
  color: DEFAULT_TECH_COLOR,
  iconName: DEFAULT_TECH_ICON,
  group: "",
  showInAbout: false,
  isProjectTech: false,
  order,
});

const TechnologyManager = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTech, setEditingTech] = useState<Partial<Technology> | null>(
    null,
  );

  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/technologies", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setTechnologies(
          json.data.sort(
            (a: Technology, b: Technology) => (a.order || 0) - (b.order || 0),
          ),
        );
      }
    } catch {
      toast.error("Ошибка при загрузке технологий");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const closeEditor = () => {
    setIsEditing(false);
    setEditingTech(null);
  };

  const handleCreate = () => {
    setEditingTech(createDefaultTechnology(technologies.length));
    setIsEditing(true);
  };

  const handleEdit = (tech: Technology) => {
    setEditingTech(tech);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту технологию?")) return;

    try {
      const res = await fetch("/api/admin/technologies", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Технология удалена");
        fetchTechnologies();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Ошибка при удалении");
    }
  };

  const handleSave = async () => {
    if (!editingTech) return;

    const normalizedTech: Partial<Technology> = {
      ...editingTech,
      name: editingTech.name?.trim() || "",
      group: editingTech.group?.trim() || "",
      iconName: editingTech.iconName?.trim() || DEFAULT_TECH_ICON,
      color: editingTech.color?.trim() || DEFAULT_TECH_COLOR,
      order: Number.isFinite(editingTech.order)
        ? Number(editingTech.order)
        : technologies.length,
      showInAbout: Boolean(editingTech.showInAbout),
      isProjectTech: Boolean(editingTech.isProjectTech),
    };

    if (!normalizedTech.name) {
      toast.error("Название обязательно");
      return;
    }

    try {
      const method = normalizedTech._id ? "PUT" : "POST";
      const res = await fetch("/api/admin/technologies", {
        method,
        body: JSON.stringify(normalizedTech),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(normalizedTech._id ? "Обновлено" : "Создано");
        closeEditor();
        fetchTechnologies();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Ошибка при сохранении");
    }
  };

  const filteredTechs = technologies.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.group?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-red-600" />
            Управление технологиями
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Добавляйте и настраивайте стек технологий для сайта
          </p>
        </div>
        <Button
          onClick={handleCreate}
          variant="neon"
          className="shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
        <Input
          className="pl-11 py-6 bg-gray-900/60 border-gray-700 rounded-xl"
          placeholder="Поиск по названию или группе..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTechs.map((tech) => {
            const IconComponent = getIconByName(tech.iconName);
            const isHex = tech.color.startsWith("#");

            return (
              <motion.div
                key={tech._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 hover:border-red-600/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={isHex ? { backgroundColor: tech.color } : {}}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{tech.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-900/50 px-2 py-0.5 rounded border border-gray-700/50">
                        {tech.group || "Без группы"}
                      </span>
                      <div className="flex gap-1">
                        {tech.showInAbout && (
                          <span title="В 'Обо мне'">
                            <Eye className="w-3 h-3 text-emerald-500" />
                          </span>
                        )}
                        {tech.isProjectTech && (
                          <span title="В проектах">
                            <Briefcase className="w-3 h-3 text-blue-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(tech)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tech._id!)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingTech?._id ? "Редактировать" : "Добавить технологию"}
                </h3>
                <button
                  onClick={closeEditor}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input
                    value={editingTech?.name || ""}
                    onChange={(e) =>
                      setEditingTech({ ...editingTech!, name: e.target.value })
                    }
                    placeholder="Напр. TypeScript, Node.js, Figma..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Иконка</Label>
                    <Input
                      value={editingTech?.iconName || ""}
                      onChange={(e) =>
                        setEditingTech({
                          ...editingTech!,
                          iconName: e.target.value,
                        })
                      }
                      placeholder="FaCode, SiReact, DiPython..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Цвет</Label>
                    <Input
                      value={editingTech?.color || ""}
                      onChange={(e) =>
                        setEditingTech({
                          ...editingTech!,
                          color: e.target.value,
                        })
                      }
                      placeholder="#6B7280"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Группа</Label>
                  <Input
                    value={editingTech?.group || ""}
                    onChange={(e) =>
                      setEditingTech({ ...editingTech!, group: e.target.value })
                    }
                    placeholder="Напр. Frontend, Backend"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <div className="flex gap-2 items-center">
                      <Eye className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-gray-300">
                        Показывать в &quot;Обо мне&quot;
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(editingTech?.showInAbout)}
                      onChange={(e) =>
                        setEditingTech({
                          ...editingTech!,
                          showInAbout: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-red-600 focus:ring-red-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <div className="flex gap-2 items-center">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-300">
                        Использовать в проектах
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(editingTech?.isProjectTech)}
                      onChange={(e) =>
                        setEditingTech({
                          ...editingTech!,
                          isProjectTech: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-red-600 focus:ring-red-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Порядок сортировки</Label>
                  <Input
                    type="number"
                    value={editingTech?.order ?? 0}
                    onChange={(e) =>
                      setEditingTech({
                        ...editingTech!,
                        order: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    onClick={closeEditor}
                    variant="secondary"
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSave}
                    variant="neon"
                    className="flex-1"
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechnologyManager;
