"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Phone, MapPin, Clock, DollarSign, CheckCircle2, 
  Calendar, Globe, ArrowRight, Star, Award, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { WorkInfo, SocialLinks } from "@/types/api";

export default function WorkPage() {
  const [workInfo, setWorkInfo] = useState<WorkInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/work-info').then(res => res.json()),
      fetch('/api/social-links').then(res => res.json()),
    ]).then(([workData, socialData]) => {
      if (workData.success) setWorkInfo(workData.data);
      if (socialData.success) setSocialLinks(socialData.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workInfo) return <div className="min-h-screen flex items-center justify-center">Информация недоступна</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects like home page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full text-red-400 font-medium mb-6 border border-red-600/30"
            >
              <Award className="w-4 h-4" />
              {workInfo.availability}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {workInfo.headline}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {workInfo.subheadline}
            </p>

            <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto">
              {workInfo.description}
            </p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <Clock className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Ответ</div>
                <div className="font-semibold text-white text-sm">{workInfo.responseTime}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <DollarSign className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-sm text-gray-400">От</div>
                <div className="font-semibold text-white text-sm">{workInfo.minBudget}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <MapPin className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Локация</div>
                <div className="font-semibold text-white text-sm">{workInfo.location}</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <Globe className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <div className="text-sm text-gray-400">Часовой пояс</div>
                <div className="font-semibold text-white text-sm">{workInfo.timezone}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      {workInfo.benefits && workInfo.benefits.length > 0 && (
        <section className="py-16 bg-black/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Почему со мной удобно работать
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workInfo.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-red-600/50 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Plans */}
      {workInfo.pricingPlans && workInfo.pricingPlans.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Тарифные планы
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Выберите подходящий вариант сотрудничества
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {workInfo.pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-8 rounded-2xl ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-2xl shadow-red-600/20 scale-105 border border-red-500/50'
                      : 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 right-8 transform -translate-y-1/2">
                      <span className="inline-flex items-center gap-1 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                        <Star className="w-4 h-4" />
                        Популярный
                      </span>
                    </div>
                  )}
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.highlighted ? 'text-white' : 'text-white'
                  }`}>
                    {plan.title}
                  </h3>
                  
                  <p className={`mb-6 ${
                    plan.highlighted ? 'text-red-100' : 'text-gray-400'
                  }`}>
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-white'
                    }`}>
                      {plan.price}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2">
                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                          plan.highlighted ? 'text-red-200' : 'text-red-600'
                        }`} />
                        <span className={`text-sm ${
                          plan.highlighted ? 'text-white' : 'text-gray-300'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-white text-red-600 hover:bg-gray-100'
                        : 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900'
                    }`}
                  >
                    Выбрать план
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Work Process */}
      {workInfo.workProcess && workInfo.workProcess.length > 0 && (
        <section className="py-16 bg-black/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Процесс работы
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Как мы будем работать над вашим проектом
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {workInfo.workProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-6 pb-12 last:pb-0"
                >
                  {index !== workInfo.workProcess!.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-red-600 to-red-800"></div>
                  )}

                  <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.step}
                  </div>

                  <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      {step.duration && (
                        <span className="flex items-center gap-1 text-sm text-red-400 font-medium">
                          <Calendar className="w-4 h-4" />
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {workInfo.faqs && workInfo.faqs.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Часто задаваемые вопросы
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {workInfo.faqs.map((faq, index) => (
                <motion.details
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 group"
                >
                  <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                    {faq.question}
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-4 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="relative py-20 bg-black/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-red-800/20 to-red-900/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Готовы начать проект?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Свяжитесь со мной чтобы обсудить детали вашего проекта
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={`mailto:${workInfo.email}`}
                className="flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
              >
                <Mail className="w-5 h-5" />
                {workInfo.email}
              </a>
              {workInfo.phone && (
                <a
                  href={`tel:${workInfo.phone}`}
                  className="flex items-center gap-2 px-8 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {workInfo.phone}
                </a>
              )}
            </div>

            {/* Social Links */}
            {socialLinks && socialLinks.showOnWorkPage && socialLinks.links.length > 0 && (
              <div>
                <p className="text-gray-300 mb-4">Или найдите меня в соцсетях:</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {socialLinks.links
                    .filter(link => link.enabled)
                    .map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-colors"
                      >
                        <span className="font-medium">{link.platform}</span>
                        {link.username && (
                          <span className="text-gray-400 text-sm">@{link.username}</span>
                        )}
                      </a>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
