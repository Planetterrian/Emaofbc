import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'noreply@emaofbc.com';

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: {
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
  }
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      reply_to: options?.replyTo,
      cc: options?.cc,
      bcc: options?.bcc,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendTransactional(
  to: string,
  subject: string,
  template: string,
  data: Record<string, unknown>
): Promise<void> {
  // Render template with data
  let html = template;
  Object.entries(data).forEach(([key, value]) => {
    html = html.replace(`{{${key}}}`, String(value ?? ''));
  });

  await sendEmail(to, subject, html);
}
