import type { NextAuthOptions, SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import {
  createUser,
  findUserByEmail,
  updateUser,
} from "~/server/services/userService";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isVerified: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null;

        const user = await findUserByEmail(credentials.email);
        if (!user || user.code !== credentials.code) return null;

        await updateUser(user.id, {
          isVerified: true,
          code: null,
          codeExpiresAt: null,
        });

        return {
          id: user.id.toString(),
          name: user.name ?? user.email.split("@")[0],
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      let dbUser = await findUserByEmail(user.email);
      if (!dbUser) {
        dbUser = await createUser({
          name: user.name ?? user.email.split("@")[0],
          email: user.email,
        });
      }
      if (!dbUser) return false;

      await updateUser(dbUser.id, { isVerified: true });
      return true;
    },
    async session({ session }) {
      const dbUser = await findUserByEmail(session.user.email ?? "");
      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.username = dbUser.username;
        session.user.isVerified = dbUser.isVerified;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/app/login",
  },
};
