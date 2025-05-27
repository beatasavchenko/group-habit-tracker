import { findUserByEmail } from "./userService";

export async function loginOrRegisterByEmail(email: string) {
  const user = await findUserByEmail(email);

  return user ?? null;
}
