/* eslint-disable @typescript-eslint/unbound-method */
/* @see https://github.com/nextauthjs/next-auth/pull/8932 */

import Discord from "@auth/core/providers/discord";
import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db } from "@2up/db";

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
  adapter: DrizzleAdapter(db),
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
