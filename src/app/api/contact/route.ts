import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Логируем запрос (для разработки)
    console.log('📧 Новый запрос:', {
      name,
      email,
      projectType,
      subject,
      message: message.substring(0, 100) + '...',
    });

    // Проверяем наличие настроек email
    const emailConfigured = 
      process.env.SMTP_HOST && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASSWORD;

    if (emailConfigured) {
      // Настраиваем транспортер nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // Типы проектов
      const projectTypeLabels: Record<string, string> = {
        landing: 'Лендинг',
        webapp: 'Веб-приложение',
        ecommerce: 'Интернет-магазин',
        corporate: 'Корпоративный сайт',
        other: 'Другое',
      };

      // Отправляем email
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        replyTo: email,
        subject: `Новый запрос с сайта: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .field { margin-bottom: 20px; }
                .field-label { font-weight: bold; color: #dc2626; margin-bottom: 5px; }
                .field-value { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>📧 Новое сообщение с сайта-портфолио</h1>
                </div>
                <div class="content">
                  <div class="field">
                    <div class="field-label">👤 Имя:</div>
                    <div class="field-value">${name}</div>
                  </div>
                  
                  <div class="field">
                    <div class="field-label">📧 Email:</div>
                    <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                  </div>
                  
                  <div class="field">
                    <div class="field-label">📂 Тип проекта:</div>
                    <div class="field-value">${projectTypeLabels[projectType] || projectType}</div>
                  </div>
                  
                  <div class="field">
                    <div class="field-label">📌 Тема:</div>
                    <div class="field-value">${subject}</div>
                  </div>
                  
                  <div class="field">
                    <div class="field-label">💬 Сообщение:</div>
                    <div class="field-value">${message.replace(/\n/g, '<br>')}</div>
                  </div>
                  
                  <div class="footer">
                    <p>Получено: ${new Date().toLocaleString('ru-RU', { 
                      timeZone: 'Asia/Almaty',
                      dateStyle: 'full',
                      timeStyle: 'short'
                    })}</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `
Новое сообщение с сайта-портфолио

Имя: ${name}
Email: ${email}
Тип проекта: ${projectTypeLabels[projectType] || projectType}
Тема: ${subject}

Сообщение:
${message}

---
Получено: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
        `,
      });

      console.log('✅ Email успешно отправлен');
    } else {
      console.warn('⚠️ SMTP не настроен. Email не отправлен. Данные сохранены в логах.');
    }

    return NextResponse.json({
      success: true,
      message: emailConfigured 
        ? 'Сообщение успешно отправлено' 
        : 'Сообщение принято (email не настроен)',
    });
  } catch (error) {
    console.error('❌ Ошибка при отправке сообщения:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: 'Не удалось отправить сообщение: ' + message },
      { status: 500 }
    );
  }
}
