import type { Adapter, AdapterAccount } from "@auth/core/adapters";
import type { Prisma } from "@prisma/client";

import { db } from "@acme/db";

export const adapter: Adapter = {
  createUser: (data) => {
    return db.user.create({ data });
  },
  getUser: (id) => {
    return db.user.findUnique({ where: { id } });
  },
  getUserByEmail: (email) => {
    return db.user.findUnique({ where: { email } });
  },
  getUserByAccount: async (provider_providerAccountId) => {
    const account = await db.account.findUnique({
      where: { provider_providerAccountId },
      select: { user: true },
    });
    return account?.user ?? null;
  },
  updateUser: ({ id, ...data }) => {
    return db.user.update({ where: { id }, data });
  },
  deleteUser: (id) => {
    return db.user.delete({ where: { id } });
  },
  linkAccount: (data) => {
    return db.account.create({ data }) as unknown as AdapterAccount;
  },
  unlinkAccount: (provider_providerAccountId) => {
    return db.account.delete({
      where: { provider_providerAccountId },
    }) as unknown as AdapterAccount;
  },
  getSessionAndUser: async (sessionToken) => {
    const userAndSession = await db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!userAndSession) return null;
    const { user, ...session } = userAndSession;
    return { user, session };
  },
  createSession: (data) => {
    return db.session.create({ data });
  },
  updateSession: (data) => {
    return db.session.update({
      where: { sessionToken: data.sessionToken },
      data,
    });
  },
  deleteSession: (sessionToken) => {
    return db.session.delete({ where: { sessionToken } });
  },
  createVerificationToken: async (data) => {
    const verificationToken = await db.verificationToken.create({ data });
    // @ts-expect-errors // MongoDB needs an ID, but we don't
    if (verificationToken.id) delete verificationToken.id;
    return verificationToken;
  },
  useVerificationToken: async (identifier_token) => {
    try {
      const verificationToken = await db.verificationToken.delete({
        where: { identifier_token },
      });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    } catch (error) {
      // If token already used/deleted, just return null
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
        return null;
      throw error;
    }
  },
};
