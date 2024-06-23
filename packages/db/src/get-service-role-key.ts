import "server-only";

import { z } from "zod";

const message =
  "Invalid Supabase Service Role Key. Please add the environment variable SUPABASE_SERVICE_ROLE_KEY.";

/**
 * @name getServiceRoleKey
 * @description Get the Supabase Service Role Key.
 * ONLY USE IN SERVER-SIDE CODE. DO NOT EXPOSE THIS TO CLIENT-SIDE CODE.
 */
export const getServiceRoleKey = () =>
  z
    .string({
      required_error: message,
    })
    .min(1, {
      message: message,
    })
    .parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
