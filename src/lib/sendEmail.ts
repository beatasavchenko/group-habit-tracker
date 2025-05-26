import { transporter } from "./mailer";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html,
  });
}
