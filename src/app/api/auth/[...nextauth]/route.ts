import NextAuth from "next-auth";
import type { SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "~/server/db"; // your db logic (SingleStore)
import { findUserByEmail } from "~/server/services/userService";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" },
        // code: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials, req) {
        const { email } = credentials as { email: string; code: string };

        const user = await findUserByEmail(email);

        // if (!user || user.otp !== code) return null;

        if(!user) return null;

        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
