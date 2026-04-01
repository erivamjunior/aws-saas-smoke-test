import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const fallbackDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/postgres?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL", fallbackDatabaseUrl),
  },
});
