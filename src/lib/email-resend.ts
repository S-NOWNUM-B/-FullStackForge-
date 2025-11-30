import { Resend } from 'resend';

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
  projectTypeLabel?: string; // Полный текст типа проекта
}

const projectTypeLabels: Record<string, string> = {
    web: "Веб-сайт (Frontend + Backend)",
    landing: "Лендинг / промо-страница",
    dashboard: "Админка / аналитический дашборд",
    mvp_figma: "Прототип в Figma",
    presentation: "Презентация / питч-дек",
    mentoring: "Менторство / консультации",
    other: "Другое"
};

export async function sendContactEmailResend(data: EmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY не настроен');
    throw new Error('RESEND_API_KEY is not configured');
  }

  const resend = new Resend(apiKey);
  // Используем переданный текст или ищем по значению
  const projectTypeLabel = data.projectTypeLabel || projectTypeLabels[data.projectType] || data.projectType;

  // HTML шаблон письма (красивый и современный)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 30px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 8px;
            border-left: 4px solid #dc2626;
          }
          .field-label {
            font-weight: 600;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .field-value {
            color: #111827;
            font-size: 16px;
            word-wrap: break-word;
          }
          .message-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 15px;
            line-height: 1.6;
          }
          .badge {
            display: inline-block;
            background: #dc2626;
            color: white;
            padding: 6px 14px;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 13px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .email-link {
            color: #dc2626;
            text-decoration: none;
            font-weight: 500;
          }
          .email-link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Новое сообщение</h1>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="field-label">Имя отправителя</div>
              <div class="field-value">${data.name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Email для связи</div>
              <div class="field-value">
                <a href="mailto:${data.email}" class="email-link">
                  ${data.email}
                </a>
              </div>
            </div>
            
            <div class="field">
              <div class="field-label">Тема сообщения</div>
              <div class="field-value">${data.subject}</div>
            </div>
            
            <div class="field">
              <div class="field-label">Тип проекта</div>
              <div class="field-value">
                <span class="badge">${projectTypeLabel}</span>
              </div>
            </div>
            
            <div class="field">
              <div class="field-label">Сообщение</div>
              <div class="message-box">${data.message}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Это автоматическое уведомление с формы контактов.</p>
            <p style="margin-top: 10px;">
              <small>Отправлено: ${new Date().toLocaleString('ru-RU', { 
                timeZone: 'Asia/Almaty',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</small>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log('Отправка email через Resend API...', {
      to: 'mamayev.stas@gmail.com',
      subject: `${data.subject} | ${data.name}`,
      replyTo: data.email,
    });

    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Можно заменить на свой домен
      to: 'mamayev.stas@gmail.com',
      replyTo: data.email,
      subject: `${data.subject} | ${data.name}`,
      html: htmlContent,
    });

    console.log('✅ Email успешно отправлен через Resend:', {
      id: result.data?.id,
      to: 'mamayev.stas@gmail.com',
    });
  } catch (error) {
    console.error('❌ Ошибка при отправке email через Resend:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}