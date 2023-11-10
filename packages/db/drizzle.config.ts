import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: "../../.env",
});

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not set");
}

export default {
  schema: "./src/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL,
  },
} satisfies Config;
