import NextAuth from "next-auth";
import type { NextAuthOptions, SessionStrategy, User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "~/server/db"; // your db logic (SingleStore)
import {
  createUser,
  findUserByEmail,
  updateUser,
} from "~/server/services/userService";
import type { NextApiHandler } from "next";
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
    Google({
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
        console.log("Authorizing with credentials:", credentials);

        if (!credentials?.email || !credentials?.code) return null;
        const user = await findUserByEmail(credentials.email);

        if (!user) return null;

        if (user.code !== credentials.code) {
          throw new Error("Invalid OTP code");
        }

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
    signIn: async ({ user, account, profile }) => {
      if (!user.email) return false;

      let existingUser = await findUserByEmail(user.email);
      if (!existingUser) {
        existingUser = await createUser({
          name: user.name ?? user.email?.split("@")[0],
          email: user.email,
        });
      }
      if (!existingUser) return false;
      await updateUser(existingUser.id, {
        isVerified: true,
      });

      return true;
    },
    async session({ session, token, user }) {
      // Fetch user data from DB based on token or email
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
    signIn: "/login",
  },
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export { handler as GET, handler as POST };
