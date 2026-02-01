"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User,
  BarChart3,
  Users,
  Calendar,
  UserCheck,
  Brain,
  Building2,
  Palette,
  HardHat,
  Ticket,
  Download
} from "lucide-react";
import Image from "next/image";

import { TECHNOLOGIES } from "@/constants/technologies";

const technologiesData = TECHNOLOGIES;

const focusAreas = [
  "Разработка современных web-приложений с использованием React и Next.js",
  "Проектирование и разработка масштабируемых backend-решений на Node.js",
  "Создание адаптивных и кроссбраузерных пользовательских интерфейсов",
  "Работа с Firebase и PostgreSQL: проектирование структуры данных и оптимизация производительности",
  "Изучение продвинутых паттернов проектирования и архитектурных решений",
  "Интеграция облачных сервисов, контейнеризация и настройка CI/CD пайплайнов",
  "Работа с системами очередей (RabbitMQ) и инструментами для тестирования API",
  "Разработка инструментов автоматизации и оптимизация рабочих процессов",
  "Применение TypeScript для типобезопасной разработки full-stack приложений",
  "Изучение и внедрение современных DevOps-практик и инструментов мониторинга",
];

const skills = [
  {
    icon: User,
    title: "Усердие",
    description: "Работаю настойчиво и внимательно, довожу начатое до конца.",
  },
  {
    icon: BarChart3,
    title: "Аналитика",
    description: "Способен глубоко анализировать информацию, выделять главное и находить оптимальные решения",
  },
  {
    icon: Users,
    title: "Управление проектами",
    description: "Организую процессы так, чтобы задачи выполнялись вовремя и качественно",
  },
  {
    icon: Calendar,
    title: "Стратегическое планирование",
    description: "Умею видеть картину целиком и строить долгосрочные цели, превращая идеи в реальные шаги",
  },
  {
    icon: UserCheck,
    title: "Командная работа",
    description: "Ценю совместный результат, умею находить общий язык и поддерживать командный дух",
  },
  {
    icon: Brain,
    title: "Критическое мышление",
    description: "Умею оценивать информацию объективно, находить слабые места и принимать взвешенные решения",
  },
];

const competencies = [
  "Full-Stack разработка с использованием JavaScript/TypeScript (React, Next.js, Node.js), Java (Spring Boot)",
  "Работа с PostgreSQL: проектирование схем, оптимизация запросов и управление базами данных",
  "Frontend-разработка с React, Next.js, TypeScript, HTML/CSS и адаптивной версткой",
  "Backend-разработка на Node.js/NestJS и Spring Boot с проектированием REST API",
  "UX/UI дизайн и прототипирование в Figma и Photoshop",
  "Работа с контейнеризацией (Docker) и системами очередей (RabbitMQ)",
  "Настройка CI/CD процессов и автоматизация развертывания",
  "Использование Git, GitHub, Postman для командной разработки и тестирования",
  "Изучение и внедрение современных архитектурных паттернов и best practices",
  "Опыт эффективной командной работы и участия в разработке корпоративных web-платформ",
];

const experience = [
  {
    title: "Цифровизация университетской инфраструктуры",
    description: "Разработка и внедрение цифровых решений для оптимизации учебных и административных процессов университета. Участие в проектировании системной архитектуры и реализации ключевых модулей.",
    icon: Building2,
  },
  {
    title: "Ребрендинг FACEPLATE",
    description: "Участие в масштабном проекте по обновлению корпоративной айдентики. Адаптация визуальных решений под современные digital-стандарты, работа над UI-концепциями.",
    icon: Palette,
  },
  {
    title: "Инженер ПТО | Глобал Связь Инжиниринг",
    description: "Техническое сопровождение государственного проекта. Контроль качества специализированного оборудования, подготовка технической документации.",
    icon: HardHat,
  },
  {
    title: 'Helpdesk система для Агентство Республики Казахстан по регулированию и развитию финансового рынка',
    description: 'Разработка веб-сервиса управления заявками для распределённых команд разработчиков. Система обеспечивает прозрачную коммуникацию между клиентами и разработчиками с отслеживанием проблем, назначением исполнителей и приоритизацией задач через административную панель и встраиваемые виджеты.',
    icon: Ticket,
  }
];

function AboutContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Привет, я <span className="text-red-600 font-semibold">Мамаев Станислав</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Fullstack Developer | Software Engineering Student
            </p>
          </motion.div>

        {/* Profile Section with Photo */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-red-600/30 bg-linear-to-br from-red-900/30 via-red-800/20 to-red-700/30 backdrop-blur-sm shadow-2xl shadow-red-600/10 mb-6">
              {/* ФОТО ПРОФИЛЯ */}
              <Image 
                src="/profile.jpeg" 
                alt="Profile Photo" 
                fill 
                className="object-cover object-top"
                priority
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <motion.a
                href="/resume.pdf"
                download="Resume_Mamaev_Stanislav.pdf"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-[#212936] hover:bg-red-700 text-white rounded-lg transition-all font-medium flex items-center justify-center gap-2 border border-gray-700/50 shadow-lg"
              >
                <Download className="w-5 h-5" />
                Скачать резюме
              </motion.a>
            </motion.div>
          </motion.div>

          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 flex flex-col justify-center"
          >
            <div className="h-full p-8 rounded-2xl bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-white mb-6">О себе</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                Разрабатываю масштабируемые приложения: от веб-сайтов до кроссплатформенного ПО. Люблю полный цикл: от архитектуры и работы с данными до удобных интерфейсов. По духу я «осознанный ботан»: увлекаюсь видеоиграми, книгами и глубокими вселенными вроде Warhammer 40,000 или Mass Effect. Широкий кругозор — от физики до истории — помогает мне находить нестандартные решения в коде. Меня вдохновляет поддержка моей девушки и музыка Noize MC: его умные тексты и ирония напрямую влияют на мой творческий подход к разработке
              </p>
            </div>
          </motion.div>
        </div>

        {/* Current Focus */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Текущий фокус</h2>
          <div className="p-8 rounded-2xl bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
            <ul className="grid md:grid-cols-2 gap-4">
              {focusAreas.map((area, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group flex items-start gap-3"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{area}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Technologies Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Технологический стек</h2>
          <div className="p-8 rounded-2xl bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-3">
              {technologiesData.map((tech, index) => {
                const Icon = tech.icon;
                // Извлекаем hex цвет из строки color
                const bgColor = tech.color.match(/#[0-9A-Fa-f]{6}/)?.[0] || '#gray';
                
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.03 }}
                    style={{ backgroundColor: bgColor }}
                    className="px-5 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer shadow-lg flex items-center gap-2 text-white hover:scale-105"
                  >
                    <Icon className="text-base" />
                    <span>{tech.name}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Skills (Навыки) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Навыки</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-6 rounded-2xl bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/10">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full border-2 border-red-500/50 bg-red-500/5 shrink-0 group-hover:bg-red-500/10 group-hover:border-red-500 transition-all">
                        <Icon className="w-7 h-7 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                          {skill.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Competencies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Ключевые компетенции</h2>
          <div className="p-8 rounded-2xl bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
            <ul className="grid md:grid-cols-2 gap-4">
              {competencies.map((competency, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.08 }}
                  className="flex items-start gap-3 group"
                >
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-red-600 shrink-0 group-hover:scale-150 transition-transform" />
                  <span className="text-gray-300 group-hover:text-white transition-colors">{competency}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Professional Experience */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Профессиональный опыт</h2>
          <div className="p-8 rounded-2xl bg-linear-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-8">Ключевые проекты</h3>
            <div className="space-y-8">
              {experience.map((exp, index) => {
                const Icon = exp.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + index * 0.2 }}
                    className={`group ${index < experience.length - 1 ? "pb-8 border-b border-gray-700/50" : ""}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-red-600/10 border border-red-600/30">
                        <Icon className="w-4 h-4 text-red-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors">
                        {exp.title}
                      </h4>
                    </div>
                    <p className="text-gray-400 leading-relaxed pl-0 group-hover:text-gray-300 transition-colors">
                      {exp.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return <AboutContent />;
}
