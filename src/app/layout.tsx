import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Портфолио | Профессиональный разработчик",
  description: "Современное портфолио разработчика с проектами и опытом работы",
  keywords: ["портфолио", "разработчик", "веб-разработка", "проекты"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://yourwebsite.com",
    title: "Портфолио | Профессиональный разработчик",
    description: "Современное портфолио разработчика с проектами и опытом работы",
    siteName: "Портфолио",
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
        className={`${inter.variable} font-sans antialiased`}
      >
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
      </body>
    </html>
  );
}
