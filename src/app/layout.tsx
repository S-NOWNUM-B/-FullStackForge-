import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: " Главная | FullStackForge",
    template: "%s | FullStackForge"
  },
  description: "Создаю надёжные и современные веб-решения для бизнеса и людей. Fullstack разработка на React, Next.js, Node.js, Firebase.",
  keywords: [
    "fullstack developer",
    "веб-разработка",
    "React",
    "Next.js", 
    "Node.js",
    "TypeScript",
    "Firebase",
    "портфолио разработчика",
    "создание сайтов",
    "разработка веб-приложений"
  ],
  authors: [{ name: "FullStackForge" }],
  creator: "FullStackForge",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    title: "FullStackForge | Fullstack Developer",
    description: "Создаю надёжные и современные веб-решения для бизнеса и людей",
    siteName: "FullStackForge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FullStackForge - Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FullStackForge | Fullstack Developer",
    description: "Создаю надёжные и современные веб-решения",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="relative min-h-screen flex flex-col">
              {children}
            </div>
            <Toaster
              position="top-right"
              richColors
              closeButton
              theme="dark"
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
