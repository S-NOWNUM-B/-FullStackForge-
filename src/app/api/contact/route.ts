import { NextRequest, NextResponse } from 'next/server';

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

    // В реальном приложении здесь была бы отправка email через сервис типа:
    // - Nodemailer
    // - SendGrid
    // - Mailgun
    // - Resend
    // 
    // Пример с Nodemailer:
    // const transporter = nodemailer.createTransport({...});
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM,
    //   to: 'mamayev.stas@gmail.com',
    //   subject: `Новый запрос: ${subject}`,
    //   html: `
    //     <h2>Новое сообщение с сайта</h2>
    //     <p><strong>Имя:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Тип проекта:</strong> ${projectType}</p>
    //     <p><strong>Тема:</strong> ${subject}</p>
    //     <p><strong>Сообщение:</strong></p>
    //     <p>${message}</p>
    //   `
    // });

    // Пока просто логируем (для разработки)
    console.log('📧 Новый запрос:', {
      name,
      email,
      projectType,
      subject,
      message: message.substring(0, 100) + '...',
    });

    // Сохраняем в MongoDB (опционально)
    // const { connectToDatabase } = await import('@/lib/mongodb');
    // const { db } = await connectToDatabase();
    // await db.collection('contacts').insertOne({
    //   name,
    //   email,
    //   projectType,
    //   subject,
    //   message,
    //   createdAt: new Date(),
    //   status: 'new'
    // });

    return NextResponse.json({
      success: true,
      message: 'Сообщение успешно отправлено'
    });

  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
