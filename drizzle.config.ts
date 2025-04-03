import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "singlestore",
  out: "./src/drizzle",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    host: process.env.SINGLESTORE_HOST ?? "",
    port: Number(process.env.SINGLESTORE_PORT ?? 0),
    user: process.env.SINGLESTORE_USER ?? "",
    password: process.env.SINGLESTORE_PASS ?? "",
    database: process.env.SINGLESTORE_DB_NAME ?? "",
    ssl: {},
  },
  verbose: true,
  strict: true,
});
