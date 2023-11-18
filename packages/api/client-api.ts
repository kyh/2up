import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "./src/root";

export const createClientApi = () => {
  return createTRPCReact<AppRouter>();
};
