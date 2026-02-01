import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Условия работы',
  description: 'Full-stack разработчик: от MVP до масштабируемых веб-приложений',
  openGraph: {
    title: 'Условия работы | FullStackForge',
    description: 'Full-stack разработчик: от MVP до масштабируемых веб-приложений',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
