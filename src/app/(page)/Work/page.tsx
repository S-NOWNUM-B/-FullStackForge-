"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Briefcase,
  Code,
  Rocket,
  FileText,
  CheckCircle2,
  XCircle,
  DollarSign,
  Clock,
  Globe,
  Mail,
  Send,
  Shield,
  Zap,
  Target,
  Database,
  Layers,
  GitBranch,
  MessageSquare
} from "lucide-react";

const projectTypes = [
  {
    icon: Rocket,
    title: "MVP стартапов",
    description: "Быстрая разработка минимально жизнеспособного продукта для валидации бизнес-идеи"
  },
  {
    icon: Shield,
    title: "Личные кабинеты и админ-панели",
    description: "Удобные интерфейсы для управления данными и контентом"
  },
  {
    icon: Target,
    title: "Лендинги и корпоративные сайты",
    description: "Современные web-сайты с акцентом на UX и конверсию"
  },
  {
    icon: Database,
    title: "Внутренние CRM/дашборды",
    description: "Системы для автоматизации бизнес-процессов компании"
  },
];

const techStack = [
  {
    category: "Frontend",
    icon: Code,
    technologies: "React, Next.js, TypeScript, Tailwind CSS, Framer Motion"
  },
  {
    category: "Backend",
    icon: Database,
    technologies: "Node.js, Python, REST API, GraphQL"
  },
  {
    category: "Базы данных",
    icon: Layers,
    technologies: "MongoDB, PostgreSQL, MySQL, Redis"
  },
  {
    category: "DevOps",
    icon: GitBranch,
    technologies: "Docker, AWS, Git, CI/CD, Render, Vercel"
  },
];

const workProcess = [
  {
    step: "01",
    title: "Заявка",
    description: "Вы заполняете форму или пишете в Telegram, описываете задачу, желаемые сроки и примерный бюджет"
  },
  {
    step: "02",
    title: "Созвон и бриф",
    description: "Уточняем цели проекта, целевую аудиторию, функционал, сроки и обсуждаем возможные риски"
  },
  {
    step: "03",
    title: "Оценка и предложение",
    description: "Отправляю документ с описанием работ, этапов, детальных сроков и стоимости проекта"
  },
  {
    step: "04",
    title: "Разработка по этапам",
    description: "Дизайн/прототип → Фронтенд → Бэкенд → Тестирование → Деплой и запуск"
  },
  {
    step: "05",
    title: "Поддержка после запуска",
    description: "Фикс-пакет по багам в течение месяца, возможность заказать дальнейшую поддержку"
  }
];

const pricingInfo = [
  {
    icon: DollarSign,
    title: "Диапазон бюджета",
    value: "От 25 000 ₸",
    description: "Минимальная стоимость проекта. Итоговая цена зависит от объема и сложности задач"
  },
  {
    icon: CheckCircle2,
    title: "Оплата",
    value: "50% предоплата",
    description: "Оставшиеся 50% после завершения. Возможны поэтапные платежи для крупных проектов"
  },
  {
    icon: Clock,
    title: "Сроки",
    value: "От 5 часов до 3 месяца",
    description: "Быстрые задачи, MVP за 1-2 недели, крупные проекты до 3 месяцев"
  },
  {
    icon: Globe,
    title: "Часовой пояс",
    value: "GMT+6 (Казахстан)",
    description: "Рабочие часы 10:00-19:00 по времени Алматы для созвонов и коммуникации"
  }
];

const includedServices = [
  "Разработка frontend и backend частей",
  "Базовое тестирование и отладка",
  "Деплой на хостинг (Render, Vercel, AWS)",
  "Краткая документация по запуску",
  "Руководство по использованию админки",
  "Настройка CI/CD и автоматизации",
  "Базовая SEO-оптимизация",
  "Адаптивная верстка для всех устройств"
];

const excludedServices = [
  "Создание контента (фотографии, видео)",
  "Сложный брендинг и фирменный стиль",
  "Регистрация и оплата доменного имени",
  "Оплата премиум-хостинга и сторонних сервисов",
  "Поддержка устаревших браузеров (IE)",
  "Интеграция с legacy-системами",
  "Аудит безопасности и пентестинг",
  "Кардинальный редизайн после утверждения",
];

const limitations = [
  "Азартные игры и букмекерские проекты",
  "Финансовые пирамиды и сомнительные схемы",
  "Проекты без четкого бюджета и сроков",
];

export default function WorkPage() {
  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
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
              Работаю над проектами, <span className="text-red-600">которые меняют мир</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Создаю веб-решения, которые работают быстро и нравятся пользователям
            </p>
          </motion.div>

          {/* Кого и с чем беру */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Кого и с чем беру</h2>
            
            {/* Типы проектов */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {projectTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group"
                  >
                    <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all">
                      <div className="p-3 rounded-full border-2 border-red-500/50 bg-red-500/5 w-fit mb-4 group-hover:bg-red-500/10 transition-all">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{type.title}</h3>
                      <p className="text-gray-400 text-sm">{type.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Формат работы и ограничения */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                  Формат работы
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Небольшие задачи от 5 часов до 3 дней</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Длительные проекты от 2 недель до 1 месяца</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>Поддержка существующих проектов</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  С чем не работаю
                </h3>
                <ul className="space-y-2">
                  {limitations.map((limit, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Как я работаю */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Как я работаю</h2>
            <div className="space-y-4">
              {workProcess.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex gap-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-white">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Условия и цены */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Условия и цены</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pricingInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="group"
                  >
                    <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm hover:border-red-500/50 transition-all">
                      <Icon className="w-8 h-8 text-red-500 mb-4" />
                      <h3 className="text-sm font-medium text-gray-400 mb-2">{item.title}</h3>
                      <div className="text-2xl font-bold text-white mb-3">{item.value}</div>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Языки общения</h3>
                  <p className="text-gray-400">Русский (Родной), Английский (Pre-Intermediate)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Что входит, а что нет */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Что входит, а что нет</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Что входит */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-green-900/20 to-gray-900/40 border border-green-700/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-red-500" />
                  Входит в стоимость
                </h3>
                <ul className="space-y-3">
                  {includedServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Что не входит */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-red-900/20 to-gray-900/40 border border-red-700/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-500" />
                  Не входит в стоимость
                </h3>
                <ul className="space-y-3">
                  {excludedServices.map((service, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-400">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Как проходит работа */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Как проходит работа
            </h2>

            <div className="rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Регулярные демонстрации прогресса</div>
                    <div className="text-sm text-gray-400">Вы видите результат на каждом этапе и можете корректировать направление до перехода к следующему шагу</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Фиксация требований в начале проекта</div>
                    <div className="text-sm text-gray-400">Детальное ТЗ защищает от недопониманий и гарантирует, что результат соответствует вашим ожиданиям</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Структурированный процесс правок</div>
                    <div className="text-sm text-gray-400">2 раунда правок на дизайне и 1 на функционале</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Прозрачная поэтапная оплата</div>
                    <div className="text-sm text-gray-400">50% перед стартом фиксирует ваш проект в графике, 50% после</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Согласование перед каждым этапом</div>
                    <div className="text-sm text-gray-400">Вы утверждаете дизайн перед версткой, верстку перед бэкендом</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Документирование всех договоренностей</div>
                    <div className="text-sm text-gray-400">Все изменения фиксируются письменно, чтобы избежать путаницы и споров в процессе</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">3 дня технической поддержки</div>
                    <div className="text-sm text-gray-400">После сдачи проекта помогаю с мелкими правками и исправлением возможных багов</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Постоянная связь на всех этапах</div>
                    <div className="text-sm text-gray-400">Отвечаю в течение 24 часов, еженедельные созвоны для обсуждения прогресса</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-900/10 border-t border-red-700/30">
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Гарантия качества:</span> Если результат не соответствует согласованному ТЗ — дорабатываю бесплатно. 
                    При изменении требований после согласования — обсуждаем дополнительное время и стоимость
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Как со мной связаться */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center"
          >
              
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Готовы обсудить проект?
            </h2>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-red-900/20 via-gray-800/40 to-gray-900/40 border border-red-700/30 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 max-w-lg mx-auto">
                <a
                  href="mailto:mamayev.stas@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  mamayev.stas@gmail.com
                </a>
                <a
                  href="https://t.me/snownumb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white rounded-xl font-semibold hover:bg-gray-600/50 hover:border-red-500/50 transition-all"
                >
                  <Send className="w-5 h-5" />
                  @snownumb
                </a>
              </div>

              <div className="max-w-2xl mx-auto p-6 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-semibold text-white text-lg text-left">Что написать в первом сообщении</h3>
                </div>
                <ul className="space-y-2.5 text-left">
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Кратко опишите задачу и цели проекта</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Приложите ссылки на прототип или примеры референсов</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>Укажите желаемые сроки и примерный бюджет</span>
                  </li>
                </ul>
              </div>

              <p className="mt-6 text-sm text-gray-400">
                Отвечу на ваше сообщение в течение 24 часов. Все остальные способы связи со мной найдёте внизу страницы.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
