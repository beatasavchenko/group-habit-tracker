import NextAuth from "next-auth";

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

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username?: string;
    isVerified?: boolean;
  }
}
