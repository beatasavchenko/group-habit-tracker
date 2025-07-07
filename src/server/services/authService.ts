import { generateOtp } from "~/lib/utils";
import { sendVerificationEmail } from "./emailService";
import { createUser, getUserByEmail, updateUser } from "./userService";
import dayjs from "dayjs";

export async function verify(email: string) {
  let user = await getUserByEmail(email);

  user ??= await createUser({ email });
  if (!user) return;
  const code = generateOtp(6);
  await updateUser(user.id, {
    code,
    codeExpiresAt: dayjs().add(5, "minutes").toDate(),
  });
  await sendVerificationEmail({ to: email, code });
}
