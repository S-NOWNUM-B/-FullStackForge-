import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPricing extends Document {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

export interface IWorkProcess extends Document {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface IWorkInfo extends Document {
  // Основная информация
  headline: string;
  subheadline: string;
  description: string;
  
  // Условия работы
  availability: string; // "Доступен для новых проектов", "Занят до..." и т.д.
  minBudget: string;
  workingHours: string;
  responseTime: string;
  
  // Тарифы
  pricingPlans: IPricing[];
  
  // Процесс работы
  workProcess: IWorkProcess[];
  
  // Преимущества
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  
  // FAQ
  faqs: {
    question: string;
    answer: string;
  }[];
  
  // Контактная информация
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const WorkInfoSchema: Schema<IWorkInfo> = new Schema(
  {
    headline: {
      type: String,
      required: [true, 'Заголовок обязателен'],
      trim: true,
      maxlength: [100, 'Максимум 100 символов'],
      default: 'Работаю над проектами, которые меняют мир',
    },
    subheadline: {
      type: String,
      trim: true,
      maxlength: [200, 'Максимум 200 символов'],
      default: 'Создаю современные веб-приложения с фокусом на UX и производительность',
    },
    description: {
      type: String,
      maxlength: [2000, 'Максимум 2000 символов'],
      default: 'Разрабатываю полнофункциональные веб-приложения используя современные технологии.',
    },
    availability: {
      type: String,
      trim: true,
      maxlength: [100, 'Максимум 100 символов'],
      default: 'Доступен для новых проектов',
    },
    minBudget: {
      type: String,
      trim: true,
      default: 'От 25.000₸',
    },
    workingHours: {
      type: String,
      trim: true,
      default: 'Пн-Пт, 10:00-19:00 (GMT+6)',
    },
    responseTime: {
      type: String,
      trim: true,
      default: 'В течение 24 часов',
    },
    pricingPlans: {
      type: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: String, required: true },
        features: [{ type: String }],
        highlighted: { type: Boolean, default: false },
      }],
      default: [],
    },
    workProcess: {
      type: [{
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        duration: { type: String },
      }],
      default: [],
    },
    benefits: {
      type: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      }],
      default: [],
    },
    faqs: {
      type: [{
        question: { type: String, required: true },
        answer: { type: String, required: true },
      }],
      default: [],
    },
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Некорректный email'],
      default: 'contact@example.com',
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Казахстан',
    },
    timezone: {
      type: String,
      trim: true,
      default: 'GMT+6',
    },
  },
  {
    timestamps: true,
  }
);

const WorkInfo: Model<IWorkInfo> = mongoose.models.WorkInfo || mongoose.model<IWorkInfo>('WorkInfo', WorkInfoSchema);

export default WorkInfo;
