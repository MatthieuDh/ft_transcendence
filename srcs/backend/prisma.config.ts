import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts", // <-- Hier staat jouw toevoeging!
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});