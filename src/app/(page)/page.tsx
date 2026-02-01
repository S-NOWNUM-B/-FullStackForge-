"use client";

import React from "react";
import Link from "next/link";
import { Code, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-black to-gray-900" />
      
      {/* Static Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Static Orbs - упростили blur */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Fullstack Developer
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up-delay">
            Помогаю бизнесу и людям через создание надёжных и современных цифровых решений
          </p>

          {/* CTAs with Icons - Unified animations */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/Projects">
                <motion.button
                  className="w-full px-8 py-3 bg-linear-to-r from-gray-800/60 to-gray-800/40 hover:from-red-600/30 hover:to-red-600/20 border border-gray-700 hover:border-red-600 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-600/20 hover:shadow-2xl"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Code className="w-5 h-5 text-red-600" />
                  </motion.div>
                  <span>Мои проекты</span>
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/About">
                <motion.button
                  className="w-full px-8 py-3 bg-linear-to-r from-gray-800/60 to-gray-800/40 hover:from-red-600/30 hover:to-red-600/20 border border-gray-700 hover:border-red-600 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-600/20 hover:shadow-2xl"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="w-5 h-5 text-red-600" />
                  </motion.div>
                  <span>Обо мне</span>
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/Work">
                <motion.button
                  className="w-full px-8 py-3 bg-linear-to-r from-gray-800/60 to-gray-800/40 hover:from-red-600/30 hover:to-red-600/20 border border-gray-700 hover:border-red-600 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-red-600/20 hover:shadow-2xl"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Zap className="w-5 h-5 text-red-600" />
                  </motion.div>
                  <span>Условия работы</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
