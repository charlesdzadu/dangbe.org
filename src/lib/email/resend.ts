/**
 * Resend transactional email through its REST API — no SDK.
 * https://resend.com/docs/api-reference/emails/send-email
 */
export type ResendMessage = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text?: string;
  reply_to?: string;
  tags?: { name: string; value: string }[];
};

export async function sendWithResend(apiKey: string, message: ResendMessage): Promise<{ messageId: string }> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend ${response.status}: ${body.slice(0, 300)}`);
  }
  const data = (await response.json()) as { id?: string };
  return { messageId: data.id ?? '' };
}
