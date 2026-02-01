"use client";

import React from "react";
import Link from "next/link";
import { Code, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      
      {/* Static Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Static Orbs - упростили blur */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Quick Access - интерактивные иконки */}
          <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
            <Link href="/Projects" className="group">
              <div className="p-4 bg-gray-800/50 hover:bg-gray-700/70 rounded-xl border border-gray-700/50 hover:border-red-600/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Code className="w-6 h-6 text-red-600 group-hover:text-red-500 transition-colors" />
                <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-2">Проекты</p>
              </div>
            </Link>
            
            <Link href="/About" className="group">
              <div className="p-4 bg-gray-800/50 hover:bg-gray-700/70 rounded-xl border border-gray-700/50 hover:border-red-600/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Sparkles className="w-6 h-6 text-red-600 group-hover:text-red-500 transition-colors" />
                <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-2">Обо мне</p>
              </div>
            </Link>
            
            <Link href="/Work" className="group">
              <div className="p-4 bg-gray-800/50 hover:bg-gray-700/70 rounded-xl border border-gray-700/50 hover:border-red-600/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                <Zap className="w-6 h-6 text-red-600 group-hover:text-red-500 transition-colors" />
                <p className="text-xs text-gray-400 group-hover:text-gray-300 mt-2">Работа</p>
              </div>
            </Link>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Fullstack Developer
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up-delay">
            Помогаю бизнесу и людям через создание надёжных и современных цифровых решений
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up-delay-2">
            <Link href="/Projects">
              <Button variant="secondary" size="xl" className="group min-w-[208px]">
                Мои проекты
              </Button>
            </Link>
            <Link href="/About">
              <Button variant="secondary" size="xl" className="min-w-[208px]">
                Обо мне
              </Button>
            </Link>
            <Link href="/Work">
              <Button variant="secondary" size="xl" className="min-w-[208px]">
                Условия работы
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
