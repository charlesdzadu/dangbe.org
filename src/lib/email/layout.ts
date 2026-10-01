const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dangbe.org';

/** A 30-line HTML shell with inline styles: every mail client renders it. */
export function emailLayout(args: { title: string; bodyHtml: string; footerNote?: string }): string {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(args.title)}</title></head>
<body style="margin:0;padding:0;background:#f6f1e7;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1b1f48;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1e7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;">
        <tr><td style="padding:28px 32px 0;font-size:22px;font-weight:700;letter-spacing:-0.04em;">dangbe<span style="color:#b6431a;">.</span></td></tr>
        <tr><td style="padding:20px 32px 8px;font-size:16px;line-height:1.55;">${args.bodyHtml}</td></tr>
        <tr><td style="padding:16px 32px 28px;font-size:13px;line-height:1.5;color:#5b5e7a;">${escapeHtml(args.footerNote ?? 'DANGBE — initiative indépendante et bénévole · ' + SITE)}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function button(href: string, label: string): string {
  return `<p style="margin:24px 0;"><a href="${escapeAttr(href)}" style="display:inline-block;background:#1b1f48;color:#f6f1e7;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;">${escapeHtml(label)}</a></p>`;
}

export function paragraph(text: string): string {
  return `<p style="margin:0 0 14px;">${escapeHtml(text)}</p>`;
}

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
