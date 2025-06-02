import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import generateOtp from "~/lib/generateOtp";
import { signInSchema } from "~/lib/signInSchema";
import { sendVerificationEmail } from "~/server/services/emailService";
import {
  createUser,
  findUserByEmail,
  updateUser,
} from "~/server/services/userService";
// import { sendVerificationEmail } from "~/server/services/emailService";
// import {
//   createUser,
//   findUserByEmail,
//   updateUser,
// } from "~/server/services/userService";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
      },
      authorize: async (credentials) => {
        const { email } = await signInSchema.parseAsync(credentials);
        const otp = generateOtp(6);

        let user = await findUserByEmail(email);
        if (!user) {
          const createdUser = await createUser(email);
          if (createdUser) {
            user = createdUser;
          }
        }

        if (user) {
          await updateUser(user.id, { code: otp });

          await sendVerificationEmail({ to: email, code: otp });
        }

        return null;
      },
    }),
  ],
});
