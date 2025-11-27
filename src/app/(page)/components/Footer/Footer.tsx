"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

// Иконка для Telegram
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

// Иконка для Taplink
const TaplinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 10-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 000-1.41c-.39-.39-1.03-.39-1.42 0z"/>
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
    icon: TaplinkIcon, 
    href: "https://taplink.cc/snownumb", 
    label: "Taplink",
    color: "hover:bg-red-600"
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-900/50 border-t border-gray-800/50 backdrop-blur-sm py-8 md:py-12">
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
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © {currentYear} DevPortfolio. Все права защищены.
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
    </footer>
  );
}
