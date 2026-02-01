'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Loader2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import type { SocialLinks as SocialLinksType, SocialLink } from '@/types/api';

function SortableItem({ link, index, onUpdate, onRemove }: { 
  link: SocialLink; 
  index: number; 
  onUpdate: (index: number, field: keyof SocialLink, value: unknown) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.platform + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 bg-black/30 backdrop-blur-sm rounded-lg space-y-3 border border-red-600/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-red-900/20 rounded"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>
          <h4 className="font-medium text-white">{link.platform || `Соц-сеть #${index + 1}`}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdate(index, 'enabled', !link.enabled)}
            className={`p-2 rounded-lg transition-colors ${
              link.enabled 
                ? 'text-green-400 bg-green-900/20 border border-green-600/30' 
                : 'text-gray-400 bg-gray-900/20 border border-gray-600/30'
            }`}
          >
            {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemove(index)}
            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors border border-red-600/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          value={link.platform}
          onChange={(e) => onUpdate(index, 'platform', e.target.value)}
          placeholder="Название платформы (GitHub, LinkedIn...)"
          className="px-3 py-2 rounded-lg border border-red-600/30 bg-black/30 backdrop-blur-sm text-gray-300 focus:border-red-600/50 focus:outline-none"
        />
        <input
          type="text"
          value={link.icon}
          onChange={(e) => onUpdate(index, 'icon', e.target.value)}
          placeholder="Иконка (github, linkedin, telegram...)"
          className="px-3 py-2 rounded-lg border border-red-600/30 bg-black/30 backdrop-blur-sm text-gray-300 focus:border-red-600/50 focus:outline-none"
        />
        <input
          type="url"
          value={link.url}
          onChange={(e) => onUpdate(index, 'url', e.target.value)}
          placeholder="URL"
          className="md:col-span-2 px-3 py-2 rounded-lg border border-red-600/30 bg-black/30 backdrop-blur-sm text-gray-300 focus:border-red-600/50 focus:outline-none"
        />
        <input
          type="text"
          value={link.username}
          onChange={(e) => onUpdate(index, 'username', e.target.value)}
          placeholder="Имя пользователя (опционально)"
          className="md:col-span-2 px-3 py-2 rounded-lg border border-red-600/30 bg-black/30 backdrop-blur-sm text-gray-300 focus:border-red-600/50 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default function SocialLinksEditor() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [socialLinks, setSocialLinks] = useState<Partial<SocialLinksType>>({
    links: [],
    showOnHeader: true,
    showOnFooter: true,
    showOnWorkPage: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const fetchSocialLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social-links');
      const data = await res.json();
      if (data.success && data.data) {
        setSocialLinks(data.data);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Не удалось загрузить соц-сети');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks),
      });

      if (res.ok) {
        toast.success('Изменения сохранены');
        fetchSocialLinks();
      } else {
        toast.error('Не удалось сохранить');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => {
    const newOrder = (socialLinks.links?.length || 0) + 1;
    setSocialLinks(prev => ({
      ...prev,
      links: [
        ...(prev.links || []),
        { platform: '', url: '', username: '', icon: 'link', enabled: true, order: newOrder },
      ],
    }));
  };

  const removeLink = (index: number) => {
    setSocialLinks(prev => ({
      ...prev,
      links: prev.links?.filter((_, i) => i !== index).map((link, i) => ({ ...link, order: i + 1 })) || [],
    }));
  };

  const updateLink = (index: number, field: keyof SocialLink, value: unknown) => {
    setSocialLinks(prev => ({
      ...prev,
      links: prev.links?.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      ) || [],
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSocialLinks(prev => {
        const links = prev.links || [];
        const oldIndex = links.findIndex((link, i) => link.platform + i === active.id);
        const newIndex = links.findIndex((link, i) => link.platform + i === over.id);

        const newLinks = arrayMove(links, oldIndex, newIndex).map((link, i) => ({
          ...link,
          order: i + 1,
        }));

        return { ...prev, links: newLinks };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Социальные сети</h2>
          <p className="text-sm text-gray-400 mt-1">
            Управление ссылками на социальные сети
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all disabled:opacity-50 shadow-lg shadow-red-600/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Сохранить
        </button>
      </div>

      {/* Display Settings */}
      <div className="bg-linear-to-br from-red-900/20 via-red-800/10 to-red-700/20 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
        <h3 className="text-lg font-semibold text-white mb-4">Настройки отображения</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={socialLinks.showOnHeader}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, showOnHeader: e.target.checked }))}
              className="rounded w-5 h-5 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
            />
            <div>
              <div className="font-medium text-white">Показывать в шапке</div>
              <div className="text-sm text-gray-400">Отображать соц-сети в header сайта</div>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={socialLinks.showOnFooter}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, showOnFooter: e.target.checked }))}
              className="rounded w-5 h-5 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
            />
            <div>
              <div className="font-medium text-white">Показывать в footer</div>
              <div className="text-sm text-gray-400">Отображать соц-сети в подвале сайта</div>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={socialLinks.showOnWorkPage}
              onChange={(e) => setSocialLinks(prev => ({ ...prev, showOnWorkPage: e.target.checked }))}
              className="rounded w-5 h-5 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
            />
            <div>
              <div className="font-medium text-white">Показывать на странице &quot;Работа&quot;</div>
              <div className="text-sm text-gray-400">Отображать соц-сети на странице информации о работе</div>
            </div>
          </label>
        </div>
      </div>

      {/* Social Links List */}
      <div className="bg-linear-to-br from-red-900/20 via-red-800/10 to-red-700/20 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Список соц-сетей</h3>
          <button
            onClick={addLink}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition-colors border border-red-600/30"
          >
            <Plus className="w-4 h-4" />
            Добавить соц-сеть
          </button>
        </div>

        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={(socialLinks.links || []).map((link, i) => link.platform + i)}
              strategy={verticalListSortingStrategy}
            >
              {(socialLinks.links || []).map((link, index) => (
                <SortableItem
                  key={link.platform + index}
                  link={link}
                  index={index}
                  onUpdate={updateLink}
                  onRemove={removeLink}
                />
              ))}
            </SortableContext>
          </DndContext>

          {(!socialLinks.links || socialLinks.links.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              Нет добавленных соц-сетей. Нажмите кнопку выше чтобы добавить.
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {socialLinks.links && socialLinks.links.length > 0 && (
        <div className="bg-linear-to-br from-red-900/20 via-red-800/10 to-red-700/20 backdrop-blur-sm rounded-xl p-6 border border-red-600/30">
          <h3 className="text-lg font-semibold text-white mb-4">Предпросмотр</h3>
          <div className="flex flex-wrap gap-3">
            {socialLinks.links
              .filter(link => link.enabled)
              .map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors border border-red-600/30"
                >
                  <span className="text-sm font-medium text-white">{link.platform}</span>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
