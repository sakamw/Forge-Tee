type BaseTemplateParams = {
  appName?: string;
  headline: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerNote?: string;
};

function baseTemplate({
  appName = "CustomTee",
  headline,
  bodyHtml,
  ctaLabel,
  ctaHref,
  footerNote,
}: BaseTemplateParams): string {
  const button =
    ctaHref && ctaLabel
      ? `<a href="${ctaHref}" style="
        display:inline-block;
        background:#0f766e;
        color:#ffffff;
        padding:12px 20px;
        border-radius:8px;
        text-decoration:none;
        font-weight:600;
        font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
        ${ctaLabel}
      </a>`
      : "";

  return `
<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;background:#f6f7fb;padding:24px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
            <tr>
              <td style="padding:20px 24px;background:linear-gradient(135deg,#0f766e,#14b8a6);color:#ffffff;">
                <div style="font-size:14px;opacity:.95;font-weight:600;letter-spacing:.3px;">${appName}</div>
                <div style="font-size:18px;font-weight:700;margin-top:4px;">${headline}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 10px 24px;color:#111827;font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
                <div style="font-size:14.5px;line-height:1.6;">${bodyHtml}</div>
                ${button ? `<div style="margin-top:18px;">${button}</div>` : ""}
                ${
                  ctaHref
                    ? `<div style="margin-top:14px;font-size:12px;color:#6b7280;word-break:break-all;">If the button doesn’t work, copy and paste this link into your browser:<br/>${ctaHref}</div>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px 22px 24px;color:#6b7280;font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;font-size:12px;border-top:1px solid #f3f4f6;">
                ${
                  footerNote ??
                  `You’re receiving this email because you have an account on ${appName}.`
                }
              </td>
            </tr>
          </table>
          <div style="margin-top:16px;color:#9ca3af;font-size:11px;font-family: Inter, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">© ${new Date().getFullYear()} ${appName}. All rights reserved.</div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function activationEmailHtml(params: {
  appName?: string;
  activationLink: string;
  firstName?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Welcome,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "Activate your account",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">Thanks for signing up. Please confirm your email address to start using <strong>${
        params.appName ?? "CustomTee"
      }</strong>.</p>
      <p style="margin:0;">This link will expire in 24 hours.</p>
    `,
    ctaLabel: "Activate account",
    ctaHref: params.activationLink,
  });
}

export function resetPasswordEmailHtml(params: {
  appName?: string;
  resetLink: string;
  firstName?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hello,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "Reset your password",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">We received a request to reset your password. Click the button below to continue.</p>
      <p style="margin:0;">This link will expire in 10 minutes. If you didn’t request this, you can safely ignore this email.</p>
    `,
    ctaLabel: "Reset password",
    ctaHref: params.resetLink,
  });
}

export function activationSuccessEmailHtml(params: {
  appName?: string;
  firstName?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hello,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "Your account is now active",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">Your account has been successfully activated. You can now sign in and start using <strong>${
        params.appName ?? "CustomTee"
      }</strong>.</p>
      <p style="margin:0;">If this wasn’t you, please contact support immediately.</p>
    `,
  });
}

export function passwordChangedEmailHtml(params: {
  appName?: string;
  firstName?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hello,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "Your password was changed",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">This is a confirmation that your password was recently changed.</p>
      <p style="margin:0;">If you did not make this change, please reset your password immediately and contact support.</p>
    `,
  });
}

export function freelancerApplicationReceivedEmailHtml(params: {
  appName?: string;
  firstName?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hello,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "We received your freelancer application",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">Thanks for applying to become a freelancer on <strong>${
        params.appName ?? "CustomTee"
      }</strong>.</p>
      <p style="margin:0 0 12px 0;">Our team will review your application shortly. You'll receive an email as soon as a decision is made.</p>
      <p style="margin:0;">No further action is needed from you right now.</p>
    `,
  });
}

export function freelancerApplicationApprovedEmailHtml(params: {
  appName?: string;
  firstName?: string;
  dashboardUrl?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hello,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "Your freelancer account is verified",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">Great news — your freelancer application has been <strong>approved</strong>!</p>
      <p style="margin:0 0 12px 0;">You can now access your freelancer dashboard to start posting designs and managing your portfolio.</p>
    `,
    ctaLabel: "Go to dashboard",
    ctaHref: params.dashboardUrl ?? "",
  });
}

export function freelancerApplicationRejectedEmailHtml(params: {
  appName?: string;
  firstName?: string;
}): string {
  const greeting = params.firstName ? `Hi ${params.firstName},` : "Hello,";
  return baseTemplate({
    appName: params.appName ?? "CustomTee",
    headline: "Your freelancer application status",
    bodyHtml: `
      <p style="margin:0 0 12px 0;">${greeting}</p>
      <p style="margin:0 0 12px 0;">Thanks for your interest in becoming a freelancer on <strong>${
        params.appName ?? "CustomTee"
      }</strong>.</p>
      <p style="margin:0 0 12px 0;">After careful review, we’re unable to approve your application at this time. You’re welcome to improve your profile and apply again in the future.</p>
      <p style="margin:0;">If you believe this was a mistake, feel free to reply to this email.</p>
    `,
  });
}
