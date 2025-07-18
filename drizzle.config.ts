import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  dbCredentials: {
    host: env.SINGLESTORE_HOST,
    port: parseInt(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {},
  },
  tablesFilter: ["group-habit-tracker_*"],
} satisfies Config;
