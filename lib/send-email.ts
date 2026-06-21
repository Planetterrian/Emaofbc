'use server';

import { createClient } from '@supabase/supabase-js';
import { getEmailTemplate, EmailData, EmailTemplate } from './email-templates';

async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: EmailData,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check notification preferences if userId is provided
    if (userId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );

      const { data: prefs } = await supabase
        .from('notification_preferences')
        .select(`email_${template}`)
        .eq('user_id', userId)
        .single();

      const prefKey = `email_${template}` as keyof typeof prefs;
      if (prefs && !prefs[prefKey]) {
        console.info(`Email ${template} skipped: user opted out`);
        return { success: true };
      }
    }

    // Get email template
    const { subject, html } = getEmailTemplate(template, data);

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@emaofbc.com',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    console.info(`Email ${template} sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email ${template}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export { sendEmail };
