"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, Clock, CheckCircle2, Briefcase, Code, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Некорректный email адрес"),
  subject: z.string().min(5, "Тема должна содержать минимум 5 символов"),
  message: z.string().min(20, "Сообщение должно содержать минимум 20 символов"),
  projectType: z.string().min(1, "Выберите тип проекта"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const projectTypes = [
    { value: "api", label: "Backend / API (FastAPI, NestJS)" },
    { value: "saas", label: "SaaS‑сервис / веб‑приложение" },
    { value: "dashboard", label: "Админка / аналитический дашборд" },
    { value: "ecommerce", label: "Интернет‑магазин / CRM‑система" },
    { value: "mvp_figma", label: "Проработка MVP и прототипа в Figma" },
    { value: "presentation", label: "Презентация продукта / питч‑дек" },
    { value: "study_project", label: "Учебный или проектный кейс" },
    { value: "landing", label: "Лендинг / промо‑страница" },
    { value: "other", label: "Другое" }
];

const features = [
  {
    icon: CheckCircle2,
    title: "Качество кода",
    description: "Чистый, масштабируемый код с документацией"
  },
  {
    icon: Zap,
    title: "Современный стек",
    description: "Использую актуальные технологии и best practices"
  },
  {
    icon: Shield,
    title: "Конфиденциальность",
    description: "Готов подписать NDA и соблюдаю конфиденциальность"
  },
  {
    icon: Clock,
    title: "Соблюдение сроков",
    description: "Всегда выполняю задачи вовремя и в согласованные сроки"
  },
];

const faqs = [
  {
    question: "Какой минимальный бюджет проекта?",
    answer: "Рассматриваю проекты от 25.000₸. Точная стоимость зависит от сложности и сроков."
  },
  {
    question: "Работаете ли вы с международными клиентами?",
    answer: "Да, работаю с клиентами по всему миру. Свободно общаюсь на русском и английском языках."
  },
  {
    question: "Предоставляете ли поддержку после запуска?",
    answer: "Да, предлагаю различные варианты технической поддержки и обслуживания после запуска проекта."
  },
  {
    question: "Какие технологии вы используете?",
    answer: "Специализируюсь на Next.js, React, TypeScript, Node.js, MongoDB, PostgreSQL и современных облачных решениях."
  },
];

export default function ContactsPage() {
  const [selectedType, setSelectedType] = useState<string>("");
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Сообщение отправлено!", {
          description: "Спасибо за ваше обращение! Я свяжусь с вами в ближайшее время.",
        });
        reset();
        setSelectedType("");
      } else {
        throw new Error('Failed to send message');
      }
    } catch {
      toast.error("Ошибка при отправке", {
        description: "Пожалуйста, попробуйте еще раз или свяжитесь со мной напрямую через email.",
      });
    }
  };

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
                Давайте обсудим <span className="text-red-600 font-semibold">ваш проект</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Готов воплотить ваши идеи в качественные веб-решения
            </p>
          </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-red-600 transition-colors"
              >
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Отправить запрос</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-white">
                    <User className="w-4 h-4 text-red-600" />
                    Ваше имя <span className="text-red-400 font-semibold">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Иван Иванов"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-white">
                    <Mail className="w-4 h-4 text-red-600" />
                    Email <span className="text-red-400 font-semibold">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="flex items-center gap-2 text-white">
                    <Briefcase className="w-4 h-4 text-red-600" />
                    Тип проекта <span className="text-red-400 font-semibold">*</span>
                  </Label>
                  <select
                    id="projectType"
                    {...register("projectType")}
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-900/50 border ${
                      errors.projectType ? "border-red-500" : "border-gray-800"
                    } rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors`}
                  >
                    <option value="">Выберите тип проекта</option>
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p className="text-sm text-red-500">{errors.projectType.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2 text-white">
                    <Code className="w-4 h-4 text-red-600" />
                    Тема сообщения <span className="text-red-400 font-semibold">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Разработка веб-приложения"
                    {...register("subject")}
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center gap-2 text-white">
                    <MessageSquare className="w-4 h-4 text-red-600" />
                    Описание проекта <span className="text-red-400 font-semibold">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Расскажите подробнее о вашем проекте: цели, функциональность, сроки, бюджет..."
                    rows={6}
                    {...register("message")}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      Отправить запрос
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                </p>
              </form>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            {/* Response Time */}
            <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-600/30 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Время ответа</h3>
                  <p className="text-gray-300 mb-3">
                    Отвечаю на запросы <span className="text-red-400 font-semibold">в течение 24 часов</span> в рабочие дни (Пн-Пт, 10:00-19:00)
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                  >
                    <h4 className="text-white font-semibold mb-2 flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      {faq.question}
                    </h4>
                    <p className="text-gray-400 text-sm pl-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">Информация о сотрудничестве</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Заключение договора и поэтапная оплата</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Еженедельные отчёты о ходе разработки</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Гарантия 1 месяц после запуска проекта</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Полный комплект исходного кода и документации</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
}
