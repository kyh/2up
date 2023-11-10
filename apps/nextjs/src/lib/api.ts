import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@2up/api";

export const api = createTRPCReact<AppRouter>();

export { type RouterInputs, type RouterOutputs } from "@2up/api";
