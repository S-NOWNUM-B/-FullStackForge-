import nodemailer from 'nodemailer';

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType: string;
}

const projectTypeLabels: Record<string, string> = {
  web: "Веб-сайт / Frontend and Backend",
  dashboard: "Админка / аналитический дашборд",
  ecommerce: "Интернет‑магазин / CRM‑система",
  mvp_figma: "Проработка MVP и прототипа в Figma",
  presentation: "Презентация продукта / питч‑дек",
  study_project: "Учебный или проектный кейс",
  landing: "Лендинг / промо‑страница",
  other: "Другое"
};

export async function sendContactEmail(data: EmailData): Promise<void> {
  // Проверяем наличие всех необходимых переменных окружения
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    console.error('❌ Отсутствуют переменные окружения для SMTP:', {
      SMTP_HOST: !!SMTP_HOST,
      SMTP_PORT: !!SMTP_PORT,
      SMTP_USER: !!SMTP_USER,
      SMTP_PASSWORD: !!SMTP_PASSWORD,
    });
    throw new Error('SMTP configuration is incomplete');
  }

  // Создаем транспорт для отправки email
  const port = parseInt(SMTP_PORT);
  
  console.log('Инициализация SMTP с параметрами:', {
    host: SMTP_HOST,
    port: port,
    secure: port === 465,
    user: SMTP_USER,
  });

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: port,
    secure: port === 465, // true для 465 (SSL), false для 587 (TLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    // Дополнительные настройки для обхода блокировок
    tls: {
      rejectUnauthorized: false, // Не проверяем SSL сертификат (для совместимости)
    },
    connectionTimeout: 30000, // 30 секунд на подключение (увеличено)
    greetingTimeout: 10000, // 10 секунд на приветствие (увеличено)
    socketTimeout: 30000, // 30 секунд на операции с сокетом
  });

  // НЕ проверяем подключение заранее, пробуем сразу отправить
  // (verify() может таймаутиться на Render, но само письмо иногда проходит)
  console.log('📨 Пропускаем verify(), пробуем отправить письмо напрямую...');

  const projectTypeLabel = projectTypeLabels[data.projectType] || data.projectType;

  // HTML шаблон письма
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
          }
          .header {
            background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border-radius: 6px;
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
          }
          .message-box {
            background: white;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            margin-top: 20px;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
          }
          .badge {
            display: inline-block;
            background: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔔 Новое сообщение с портфолио</h1>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="field-label">Имя отправителя</div>
            <div class="field-value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email для связи</div>
            <div class="field-value">
              <a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none;">
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
          <p>Это автоматическое уведомление с формы контактов вашего портфолио.</p>
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
      </body>
    </html>
  `;

  // Текстовая версия письма (для клиентов без поддержки HTML)
  const textContent = `
Новое сообщение с портфолио

Имя: ${data.name}
Email: ${data.email}
Тема: ${data.subject}
Тип проекта: ${projectTypeLabel}

Сообщение:
${data.message}

---
Отправлено: ${new Date().toLocaleString('ru-RU')}
  `.trim();

  // Отправляем письмо
  const mailOptions = {
    from: `"Портфолио - Форма контактов" <${SMTP_USER}>`,
    to: SMTP_USER, // Отправляем на тот же email
    replyTo: data.email, // Ответ будет отправлен клиенту
    subject: `📩 ${data.subject} | ${data.name}`,
    text: textContent,
    html: htmlContent,
  };

  try {
    console.log('Отправка письма...', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email успешно отправлен:', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject,
      response: info.response,
    });
  } catch (error) {
    const errorObj = error as { code?: string; command?: string };
    console.error('❌ Ошибка при отправке email:', {
      error: error,
      code: errorObj.code,
      command: errorObj.command,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}
