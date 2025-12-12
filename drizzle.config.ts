import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing! Set DATABASE_URL or all POSTGRES_* variables."
    );
}

export default defineConfig({
    schema: "./src/app/db/schema.ts",
    out: "./src/app/db/drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: DATABASE_URL,
    },
});
