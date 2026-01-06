import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/data/db';
import ContactMessage from '@/data/models/ContactMessage';

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
  projectTypeLabel?: string;
}

// Функция для отправки email через Resend
async function sendEmailWithResend(data: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY не установлен, email не будет отправлен');
    return;
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const projectTypeLabels: Record<string, string> = {
      web: "Веб-сайт / Frontend + Backend",
      landing: "Лендинг / промо-страница",
      dashboard: "Админка / аналитический дашборд",
      mvp_figma: "Прототип в Figma",
      presentation: "Презентация / питч-дек",
      mentoring: "Менторство / консультации",
      other: "Другое"
    };

    const projectTypeLabel = data.projectTypeLabel || projectTypeLabels[data.projectType] || data.projectType;

    await resend.emails.send({
      from: 'FullStackForge <noreply@fullstackforge.com>', // Замените на ваш домен
      to: process.env.SMTP_USER || 'your-email@example.com',
      subject: `Новое сообщение: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Новое сообщение с сайта</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #dc2626; margin-top: 0;">Информация об отправителе</h2>
              <p><strong>Имя:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #dc2626;">${data.email}</a></p>
              <p><strong>Тип проекта:</strong> ${projectTypeLabel}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #dc2626; margin-top: 0;">Тема: ${data.subject}</h3>
              <div style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
            </div>
          </div>

          <div style="background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Это автоматическое сообщение с вашего сайта FullStackForge</p>
          </div>
        </div>
      `,
    });

    console.log('✅ Email отправлен через Resend');
  } catch (error) {
    console.error('❌ Ошибка при отправке через Resend:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, projectType, projectTypeLabel } = body;

    // Валидация данных
    if (!name || !email || !subject || !message || !projectType) {
      return NextResponse.json(
        { success: false, error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Некорректный email адрес' },
        { status: 400 }
      );
    }

    // Подключаемся к базе данных
    await connectDB();

    // Сохраняем сообщение в MongoDB
    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      projectType,
      status: 'new',
    });

    console.log('✅ Сообщение сохранено в БД:', {
      id: contactMessage._id,
      name,
      email,
      projectType,
    });

    // Отправляем email
    try {
      const emailData = { name, email, subject, message, projectType, projectTypeLabel };
      await sendEmailWithResend(emailData);
    } catch (emailError) {
      console.error('⚠️ Ошибка при отправке email (но сообщение сохранено в БД):', emailError);
      // Не возвращаем ошибку пользователю, так как сообщение уже сохранено
    }

    return NextResponse.json({
      success: true,
      message: 'Сообщение успешно отправлено',
    });
  } catch (error) {
    console.error('❌ Ошибка при сохранении сообщения:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Не удалось отправить сообщение: ' + message },
      { status: 500 }
    );
  }
}
