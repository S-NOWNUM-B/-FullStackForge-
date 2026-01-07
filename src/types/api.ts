// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Project types
export interface Project {
  _id: string;
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
  // Новые поля
  status: 'draft' | 'published';
  featured: boolean;
  completedAt?: string;
  clientName?: string;
  projectDuration?: string;
  challenges?: string;
  results?: string;
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  total: number;
}

// Contact types
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// Config types
export type ConfigKey = 'home' | 'about' | 'contact';

export interface Config {
  _id: string;
  key: ConfigKey;
  title: string;
  subtitle: string;
  content: string;
  updatedAt: string;
}

// Auth types
export interface AdminCredentials {
  password: string;
}

export interface AuthSession {
  user: {
    id: string;
    role: 'admin';
  };
  expires: string;
}

// WorkInfo types
export interface Pricing {
  title: string;
  description: string;
  price: string;
  features: string[];
  highlighted: boolean;
}

export interface WorkProcess {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface WorkInfo {
  _id: string;
  headline: string;
  subheadline: string;
  description: string;
  availability: string;
  minBudget: string;
  workingHours: string;
  responseTime: string;
  pricingPlans: Pricing[];
  workProcess: WorkProcess[];
  benefits: Benefit[];
  faqs: FAQ[];
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

// SocialLinks types
export interface SocialLink {
  platform: string;
  url: string;
  username: string;
  icon: string;
  enabled: boolean;
  order: number;
}

export interface SocialLinks {
  _id: string;
  links: SocialLink[];
  showOnHeader: boolean;
  showOnFooter: boolean;
  showOnWorkPage: boolean;
  createdAt: string;
  updatedAt: string;
}
