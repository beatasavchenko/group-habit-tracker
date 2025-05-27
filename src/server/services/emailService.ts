import { render } from "@react-email/components";
import { sendEmail } from "~/lib/sendEmail";
import { renderOtpEmail } from "~/emails/otpTemplate";

type VerificationEmailProps = {
  to: string;
  code: string;
};

export async function sendVerificationEmail(props: VerificationEmailProps) {
  const emailHtml = await renderOtpEmail({ code: props.code });

  await sendEmail({
    to: props.to,
    subject: "Your OTP Code",
    html: emailHtml,
  });
}
