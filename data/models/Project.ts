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
      maxlength: [3000, 'Максимум 3000 символов'],
    },
    functionality: {
      type: String,
      required: [true, 'Описание функционала обязательно'],
      maxlength: [3000, 'Максимум 3000 символов'],
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
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ title: 'text', shortDescription: 'text' });
ProjectSchema.index({ category: 1 });

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
