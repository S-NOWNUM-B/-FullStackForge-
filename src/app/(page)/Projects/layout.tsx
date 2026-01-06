import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Проекты',
  description: 'Портфолио реализованных проектов - веб-приложения, сайты, дашборды и другие решения с использованием современных технологий',
  openGraph: {
    title: 'Проекты | FullStackForge',
    description: 'Портфолио реализованных проектов',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
