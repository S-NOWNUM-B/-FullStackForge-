"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, Phone, Clock, DollarSign, CheckCircle2, 
  Star, Briefcase, Zap, Target, Shield
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!workInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Информация недоступна</div>
      </div>
    );
  }

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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full text-red-400 font-medium mb-6 border border-red-600/30"
            >
              <Briefcase className="w-4 h-4" />
              {workInfo.availability}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {workInfo.headline}
            </h1>
            
            <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">
              {workInfo.subheadline}
            </p>

            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              {workInfo.description}
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Clock className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Ответ</div>
              <div className="font-semibold text-white text-lg">{workInfo.responseTime}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <DollarSign className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Бюджет от</div>
              <div className="font-semibold text-white text-lg">{workInfo.minBudget}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Zap className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Часовой пояс</div>
              <div className="font-semibold text-white text-lg">{workInfo.timezone}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center">
              <Target className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-sm text-gray-400 mb-1">Локация</div>
              <div className="font-semibold text-white text-lg">{workInfo.location}</div>
            </div>
          </motion.div>

          {/* Benefits */}
          {workInfo.benefits && workInfo.benefits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                Почему со мной удобно работать
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {workInfo.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-red-600/50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pricing Plans */}
          {workInfo.pricingPlans && workInfo.pricingPlans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                Тарифные планы
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Выберите подходящий вариант сотрудничества. Предоплата 50%
              </p>

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
                        ? 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-2xl shadow-red-600/20 scale-105 border-2 border-red-500/50'
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
                    
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {plan.title}
                    </h3>
                    
                    <p className={`mb-6 text-sm ${
                      plan.highlighted ? 'text-red-100' : 'text-gray-400'
                    }`}>
                      {plan.description}
                    </p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
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
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Готовы начать проект?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Свяжитесь со мной чтобы обсудить детали вашего проекта
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href={`mailto:${workInfo.email}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {workInfo.email}
                </a>
                {workInfo.phone && (
                  <a
                    href={`tel:${workInfo.phone}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-white rounded-xl font-semibold hover:bg-gray-600/50 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {workInfo.phone}
                  </a>
                )}
              </div>

              {/* Social Links */}
              {socialLinks && socialLinks.showOnWorkPage && socialLinks.links.length > 0 && (
                <div className="pt-6 border-t border-gray-700/50">
                  <p className="text-gray-400 mb-4">
                    Или напишите в удобную для вас социальную сеть из списка в футере сайта
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {socialLinks.links
                      .filter(link => link.enabled)
                      .slice(0, 4)
                      .map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 rounded-lg transition-colors"
                        >
                          <span className="font-medium text-white">{link.platform}</span>
                          {link.username && (
                            <span className="text-gray-400 text-sm">@{link.username}</span>
                          )}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
