import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/data/db';
import ContactMessage from '@/data/models/ContactMessage';
import { sendContactEmail } from '@/lib/email';

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
}

// Функция для динамической загрузки Resend (если установлен)
async function sendEmailWithResend(data: EmailData) {
  try {
    const { sendContactEmailResend } = await import('@/lib/email-resend');
    return await sendContactEmailResend(data);
  } catch (error) {
    console.log('⚠️ Resend не установлен, используем SMTP');
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, projectType } = body;

    // Валидация данных
    if (!name || !email || !subject || !message || !projectType) {
      return NextResponse.json(
        { success: false, error: 'Все поля обязательны для заполнения' },
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
      const emailData = { name, email, subject, message, projectType };
      
      // Пробуем Resend (если RESEND_API_KEY установлен)
      if (process.env.RESEND_API_KEY) {
        console.log('📧 Используем Resend API для отправки email');
        await sendEmailWithResend(emailData);
      } else {
        // Иначе используем SMTP
        console.log('📧 Используем SMTP для отправки email');
        await sendContactEmail(emailData);
      }
      
      console.log('✅ Email успешно отправлен на почту');
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
