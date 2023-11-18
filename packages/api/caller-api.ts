import { auth } from "@2up/auth";
import { db } from "@2up/db";

import { appRouter } from "./src/root";

export const createCallerApi = async () => {
  return appRouter.createCaller({
    db,
    session: await auth(),
  });
};
