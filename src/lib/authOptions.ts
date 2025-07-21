import type { NextAuthOptions, SessionStrategy } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import {
  createUser,
  getUserByEmail,
  updateUser,
} from "~/server/services/userService";

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

        const user = await getUserByEmail(credentials.email);
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
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      let dbUser = await getUserByEmail(user.email);
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
    async jwt({ token, user }) {
      let email = user?.email ?? token.email;
      if (email) {
        const dbUser = await getUserByEmail(email);
        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.isVerified = dbUser.isVerified;
          token.globalStreakCount = dbUser.globalStreakCount;
          token.globalStreakLastLoggedAt = dbUser.globalLastLoggedAt;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
        }
      }
      token.id = token.id ?? null;
      token.username = token.username ?? undefined;
      token.isVerified = token.isVerified ?? false;
      token.globalStreakCount = token.globalStreakCount ?? 0;
      token.globalStreakLastLoggedAt = token.globalStreakLastLoggedAt ?? null;
      token.name = token.name ?? null;
      token.email = token.email ?? null;
      token.picture = token.picture ?? null;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? null;
        session.user.username = token.username ?? undefined;
        session.user.isVerified = token.isVerified ?? false;
        session.user.globalStreakCount = 0;
        session.user.globalStreakLastLoggedAt = null;
        session.user.name = token.name ?? session.user.name ?? null;
        session.user.email = token.email ?? session.user.email ?? null;
        session.user.image = token.picture ?? session.user.image ?? null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/app/login",
  },
};
