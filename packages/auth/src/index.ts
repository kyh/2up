import Discord from "@auth/core/providers/discord";
import type { DefaultSession } from "@auth/core/types";
import NextAuth from "next-auth";

import { adapter } from "./adapter";

export type { Session } from "next-auth";

declare module "next-auth" {
  type Session = {
    user: {
      id: string;
    } & DefaultSession["user"];
  };
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
});
