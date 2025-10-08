import mongoose, { Schema, Document, Model } from 'mongoose';

export type ConfigKey = 'home' | 'about' | 'contact';

export interface IConfig extends Document {
  key: ConfigKey;
  title: string;
  subtitle: string;
  content: string;
  updatedAt: Date;
}

const ConfigSchema: Schema<IConfig> = new Schema(
  {
    key: {
      type: String,
      required: [true, 'Ключ конфигурации обязателен'],
      enum: {
        values: ['home', 'about', 'contact'],
        message: 'Ключ должен быть одним из: home, about, contact',
      },
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Заголовок обязателен'],
      trim: true,
      maxlength: [200, 'Заголовок не может превышать 200 символов'],
    },
    subtitle: {
      type: String,
      required: [true, 'Подзаголовок обязателен'],
      trim: true,
      maxlength: [500, 'Подзаголовок не может превышать 500 символов'],
    },
    content: {
      type: String,
      required: [true, 'Контент обязателен'],
      maxlength: [5000, 'Контент не может превышать 5000 символов'],
    },
  },
  {
    timestamps: true,
  }
);

// Индекс уже определен в схеме выше

const Config: Model<IConfig> =
  mongoose.models.Config || mongoose.model<IConfig>('Config', ConfigSchema);

export default Config;
