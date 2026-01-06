import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLink {
  platform: string;
  url: string;
  username: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface ISocialLinks extends Document {
  links: ISocialLink[];
  showOnHeader: boolean;
  showOnFooter: boolean;
  showOnWorkPage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinksSchema: Schema<ISocialLinks> = new Schema(
  {
    links: {
      type: [{
        platform: {
          type: String,
          required: [true, 'Название платформы обязательно'],
          trim: true,
        },
        url: {
          type: String,
          required: [true, 'URL обязателен'],
          trim: true,
        },
        username: {
          type: String,
          trim: true,
          default: '',
        },
        icon: {
          type: String,
          required: [true, 'Иконка обязательна'],
          default: 'link',
        },
        enabled: {
          type: Boolean,
          default: true,
        },
        order: {
          type: Number,
          default: 0,
        },
      }],
      default: [
        {
          platform: 'GitHub',
          url: 'https://github.com',
          username: '',
          icon: 'github',
          enabled: true,
          order: 1,
        },
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com',
          username: '',
          icon: 'linkedin',
          enabled: true,
          order: 2,
        },
        {
          platform: 'Telegram',
          url: 'https://t.me/',
          username: '',
          icon: 'telegram',
          enabled: true,
          order: 3,
        },
      ],
    },
    showOnHeader: {
      type: Boolean,
      default: true,
    },
    showOnFooter: {
      type: Boolean,
      default: true,
    },
    showOnWorkPage: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

SocialLinksSchema.index({ 'links.order': 1 });

const SocialLinks: Model<ISocialLinks> = mongoose.models.SocialLinks || mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);

export default SocialLinks;
