import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const ContactMessageSchema: Schema<IContactMessage> = new Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    maxlength: [100, 'Имя не может превышать 100 символов'],
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Некорректный email адрес'],
    maxlength: [255, 'Email не может превышать 255 символов'],
  },
  subject: {
    type: String,
    required: [true, 'Тема обязательна'],
    trim: true,
    maxlength: [200, 'Тема не может превышать 200 символов'],
  },
  message: {
    type: String,
    required: [true, 'Сообщение обязательно'],
    maxlength: [5000, 'Сообщение не может превышать 5000 символов'],
  },
  projectType: {
    type: String,
    required: [true, 'Тип проекта обязателен'],
    enum: {
      values: ['web', 'landing', 'dashboard', 'mvp_figma', 'presentation', 'mentoring', 'other'],
      message: 'Некорректный тип проекта',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['new', 'read', 'replied'],
      message: 'Некорректный статус',
    },
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Индексы для быстрого поиска
ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ status: 1 });
ContactMessageSchema.index({ email: 1 });

const ContactMessage: Model<IContactMessage> = 
  mongoose.models.ContactMessage || mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;
