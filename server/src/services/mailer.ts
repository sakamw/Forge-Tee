import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL;
const fromName = process.env.FROM_NAME || "CustomTee";

if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: { user: smtpUser, pass: smtpPass },
});

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailArgs): Promise<void> {
  await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    replyTo: "noreply@fix.com",
    to,
    subject,
    html,
  });
}
