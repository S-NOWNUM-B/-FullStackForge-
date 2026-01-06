import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  functionality: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  category: string;
  githubUrl: string;
  demoUrl: string;
  // Новые поля для расширенного функционала
  status: 'draft' | 'published' | 'archived';
  featured: boolean; // Избранный проект для главной
  completedAt?: Date; // Дата завершения проекта
  clientName?: string; // Название клиента
  projectDuration?: string; // "2 месяца", "3 недели" и т.д.
  challenges?: string; // Какие проблемы решались
  results?: string; // Какие результаты достигнуты
  viewsCount: number; // Счетчик просмотров
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Название проекта обязательно'],
      trim: true,
      maxlength: [100, 'Название не может превышать 100 символов'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Краткое описание обязательно'],
      maxlength: [200, 'Максимум 200 символов'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Полное описание обязательно'],
      maxlength: [5000, 'Максимум 5000 символов'],
    },
    functionality: {
      type: String,
      required: [true, 'Описание функционала обязательно'],
      maxlength: [5000, 'Максимум 5000 символов'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Главное изображение обязательно'],
    },
    images: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      required: [true, 'Укажите хотя бы одну технологию'],
    },
    category: {
      type: String,
      required: [true, 'Категория обязательна'],
      enum: ['Web', 'Mobile', 'Desktop', 'Design', 'AI/ML', 'Другое'],
    },
    githubUrl: {
      type: String,
      default: '',
    },
    demoUrl: {
      type: String,
      default: '',
    },
    // Новые поля
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    clientName: {
      type: String,
      trim: true,
      maxlength: [100, 'Максимум 100 символов'],
    },
    projectDuration: {
      type: String,
      trim: true,
      maxlength: [50, 'Максимум 50 символов'],
    },
    challenges: {
      type: String,
      maxlength: [2000, 'Максимум 2000 символов'],
    },
    results: {
      type: String,
      maxlength: [2000, 'Максимум 2000 символов'],
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ title: 'text', shortDescription: 'text' });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ status: 1 }); // Для фильтрации
ProjectSchema.index({ featured: 1 }); // Для быстрого поиска избранных

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
