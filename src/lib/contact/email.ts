import { validateContactConfig } from './validation';

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const INQUIRY_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  support: 'Support',
  partnership: 'Partnership',
  business: 'Business Inquiry',
  pricing: 'Pricing',
  other: 'Other',
};

export async function sendContactEmail(submission: ContactSubmission): Promise<void> {
  const status = validateContactConfig();
  if (!status.isValid) {
    throw new Error(`[Contact Config Validation Error] Missing required keys: ${status.missingKeys.join(', ')}`);
  }

  const inquiryLabel = INQUIRY_LABELS[submission.inquiryType] || 'General Inquiry';

  const html = `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #18181b;">
      <h2 style="margin: 0 0 4px; font-size: 18px;">New contact form submission</h2>
      <p style="margin: 0 0 20px; color: #71717a; font-size: 13px;">Love Sync &mdash; ${escapeHtml(inquiryLabel)}</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tbody>
          <tr><td style="padding: 6px 0; color: #71717a; width: 120px;">Name</td><td style="padding: 6px 0;">${escapeHtml(submission.name)}</td></tr>
          <tr><td style="padding: 6px 0; color: #71717a;">Email</td><td style="padding: 6px 0;">${escapeHtml(submission.email)}</td></tr>
          ${submission.phone ? `<tr><td style="padding: 6px 0; color: #71717a;">Phone</td><td style="padding: 6px 0;">${escapeHtml(submission.phone)}</td></tr>` : ''}
          ${submission.company ? `<tr><td style="padding: 6px 0; color: #71717a;">Company</td><td style="padding: 6px 0;">${escapeHtml(submission.company)}</td></tr>` : ''}
          <tr><td style="padding: 6px 0; color: #71717a;">Inquiry Type</td><td style="padding: 6px 0;">${escapeHtml(inquiryLabel)}</td></tr>
        </tbody>
      </table>
      <p style="margin: 20px 0 6px; color: #71717a; font-size: 13px;">Message</p>
      <p style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; border-left: 3px solid #e4e4e7; padding-left: 12px;">${escapeHtml(submission.message)}</p>
    </div>
  `.trim();

  const text = [
    `New contact form submission (${inquiryLabel})`,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    submission.company ? `Company: ${submission.company}` : null,
    `Inquiry Type: ${inquiryLabel}`,
    '',
    'Message:',
    submission.message,
  ].filter(Boolean).join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${status.values.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: status.values.fromEmail,
      to: [status.values.recipientEmail],
      reply_to: submission.email,
      subject: `[Love Sync Contact] ${inquiryLabel} — ${submission.name}`,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`[Resend API Error] ${response.status}: ${errorBody.slice(0, 300)}`);
  }
}
