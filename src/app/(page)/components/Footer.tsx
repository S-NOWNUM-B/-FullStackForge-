"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

// Иконка для Telegram
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

// Иконка для Watsapp
const WhatsappIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.4 4.8L2 22l5.4-1.4C8.8 21.5 10.4 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-2.9-.4-4.1-1.2l-.3-.2-3.2.9.9-3.1-.2-.3C4.4 15 4 13.6 4 12 4 7.6 7.6 4 12 4s8 3.6 8 8-3.6 8-8 8zm4-5.3c-.2-.1-1.3-.7-1.5-.8-.2-.1-.3-.1-.5.1-.1.2-.6.8-.7.9-.1.1-.3.1-.5 0-.2-.1-.9-.3-1.7-1.1-.6-.5-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1.1-.2.2-.3.1-.1 0-.2 0-.3 0-.1-.5-1.2-.7-1.6-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.3 0-.4.2-.2.2-.7.7-.7 1.8 0 1.1.8 2.2.9 2.4.1.2 1.6 2.4 3.8 3.3.5.2.9.3 1.2.4.5.2.9.2 1.2.1.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1 0-.1-.2-.1-.4-.2z" />
    </svg>
);

const socialLinks = [
    {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/стас-мамаев-b9a868316/",
        label: "LinkedIn",
        color: "hover:bg-[#0077B5]"
    },
    {
        icon: Github,
        href: "https://github.com/S-NOWNUM-B",
        label: "GitHub",
        color: "hover:bg-gray-700"
    },
    {
        icon: Mail,
        href: "mailto:mamayev.stas@gmail.com",
        label: "Email",
        color: "hover:bg-red-600"
    },
    {
        icon: TelegramIcon,
        href: "https://t.me/snownumb",
        label: "Telegram",
        color: "hover:bg-[#0088cc]"
    },
    {
        icon: WhatsappIcon,
        href: "https://wa.me/message/7TZW2OWPDQY4E1",
        label: "WhatsApp",
        color: "hover:bg-[#25D366]"
    },
];

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative bg-black py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 bg-gray-800 rounded-lg text-white transition-all font-medium flex items-center gap-2 ${social.color}`}
                  aria-label={social.label}
                >
                  <Icon />
                  {social.label}
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-gray-700 to-transparent mb-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-500 text-sm" suppressHydrationWarning>
            © {currentYear ?? ""} FullStackForge. Все права защищены.
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-red-600/30 to-transparent" />
    </footer>
  );
}
