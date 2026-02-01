import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Обо мне',
  description: 'Fullstack разработчик с опытом создания современных веб-решений. Специализация: React, Next.js, Node.js, TypeScript, Firebase',
  openGraph: {
    title: 'Обо мне | FullStackForge',
    description: 'Fullstack разработчик с опытом создания современных веб-решений',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
