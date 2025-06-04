import generateOtp from "~/lib/generateOtp";
import { sendVerificationEmail } from "./emailService";
import { createUser, findUserByEmail, updateUser } from "./userService";
import dayjs from "dayjs";

export async function verify(email: string) {
  let user = await findUserByEmail(email);
  if (!user) user = await createUser(email);
  if (!user) return;
  const code = generateOtp(6);
  await updateUser(user.id, {
    code,
    codeExpiresAt: dayjs().add(5, "minutes").toDate(),
  });
  sendVerificationEmail({ to: email, code });
}
