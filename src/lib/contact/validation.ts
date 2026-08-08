import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface ContactConfigStatus {
  isValid: boolean;
  missingKeys: string[];
  values: {
    resendApiKey: string;
    recipientEmail: string;
    fromEmail: string;
    turnstileSecretKey: string;
  };
}

function getEnv(): Record<string, any> {
  try {
    const context = getCloudflareContext();
    if (context && context.env) {
      return { ...process.env, ...context.env };
    }
  } catch (e) {
    // Suppress warning during static building / SSR outside Workers
  }
  return process.env;
}

/**
 * Server-only config resolver. The recipient address is intentionally never
 * hardcoded here - it must be supplied via the CONTACT_RECIPIENT_EMAIL
 * environment variable (Cloudflare secret) so it never enters source control
 * or any client-visible bundle.
 */
export function validateContactConfig(): ContactConfigStatus {
  const env = getEnv();

  const getVal = (key: string): string => (env[key] || '').trim();

  const resendApiKey = getVal('RESEND_API_KEY');
  const recipientEmail = getVal('CONTACT_RECIPIENT_EMAIL');
  const fromEmail = getVal('CONTACT_FROM_EMAIL') || 'Love Sync <onboarding@resend.dev>';
  const turnstileSecretKey = getVal('TURNSTILE_SECRET_KEY');

  const requiredMapping = {
    RESEND_API_KEY: resendApiKey,
    CONTACT_RECIPIENT_EMAIL: recipientEmail,
  };

  const missingKeys = Object.entries(requiredMapping)
    .filter(([_, val]) => !val)
    .map(([key]) => key);

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    values: {
      resendApiKey,
      recipientEmail,
      fromEmail,
      turnstileSecretKey,
    },
  };
}
