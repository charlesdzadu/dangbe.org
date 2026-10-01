import { sendWithResend } from './resend';

export type Mail = {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
  tags?: string[];
};

export type SendOutcome = { transport: 'resend'; messageId: string } | { transport: 'console' };

const FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS ?? 'programme@dangbe.org';
const FROM_NAME = process.env.EMAIL_FROM_NAME ?? 'DANGBE';
const REPLY_TO = process.env.EMAIL_REPLY_TO;

/* Resend tag values allow ASCII letters, digits, underscores and dashes only. */
const tagValue = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, '-');

/**
 * One door for every email. Without RESEND_API_KEY (local dev, CI) the mail is
 * printed to the console instead of sent — the flow still completes and the
 * link can be copied from the terminal. The caller logs the outcome.
 */
export async function sendMail(mail: Mail): Promise<SendOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`\n[mail:console] to=${mail.to.email} subject="${mail.subject}"\n${mail.text}\n`);
    return { transport: 'console' };
  }
  const { messageId } = await sendWithResend(apiKey, {
    from: `${FROM_NAME} <${FROM_ADDRESS}>`,
    to: [mail.to.name ? `${mail.to.name} <${mail.to.email}>` : mail.to.email],
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
    ...(mail.tags?.length ? { tags: mail.tags.map((t) => ({ name: 'kind', value: tagValue(t) })) } : {}),
  });
  return { transport: 'resend', messageId };
}

/** The team inboxes that get a heads-up on a new application (comma-separated env). */
export function teamNotifyEmails(): string[] {
  return (process.env.TEAM_NOTIFY_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
