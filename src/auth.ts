import NextAuth from "next-auth";
import { authOptions } from "./lib/authOptions";

const authHandler = NextAuth(authOptions);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = authHandler;
