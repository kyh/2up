import { z } from "zod";

const message =
  "Invalid Database Url. Please add the environment variable POSTGRES_URL.";

/**
 * @name getDatabaseUrl
 * @description Get the database URL.
 * ONLY USE IN SERVER-SIDE CODE. DO NOT EXPOSE THIS TO CLIENT-SIDE CODE.
 */
export const getDatabaseUrl = () =>
  z
    .string({
      required_error: message,
    })
    .min(1, {
      message: message,
    })
    .parse(process.env.POSTGRES_URL);
