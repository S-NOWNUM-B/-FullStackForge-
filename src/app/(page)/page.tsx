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
          {/* Icon Features - упростили анимацию */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            {[Code, Sparkles, Zap].map((Icon, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 backdrop-blur-sm transform transition-transform hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-6 h-6 text-red-600" />
              </div>
            ))}
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Fullstack Developer
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto animate-slide-up-delay">
            Создаю надёжные и современные веб-решения для бизнеса и людей
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
