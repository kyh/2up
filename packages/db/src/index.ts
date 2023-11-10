import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";
import * as uuid from "./uuid";

export * from "drizzle-orm";

export { schema, uuid };

export const db = drizzle(sql, { schema });
