import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

// Load local .env file if present and DATABASE_URL is not already in process.env
const envPath = fileURLToPath(new URL("../.env", import.meta.url));
if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore if already loaded or unreadable
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL must be set before running migrations.");
  process.exit(1);
}

const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));
const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  // Create migrations table if it doesn't exist
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const appliedResult = await client.query("SELECT version FROM schema_migrations");
  const applied = new Set(appliedResult.rows.map((r) => r.version));

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`- Migration already applied: ${file}`);
      continue;
    }

    console.log(`Applying migration: ${file}...`);
    const sql = await readFile(path.join(migrationsDir, file), "utf8");

    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`✓ Migration applied: ${file}`);
    } catch (err) {
      await client.query("ROLLBACK").catch(() => undefined);
      console.error(`✗ Migration failed on ${file}:`, err);
      throw err;
    }
  }

  console.log("All database migrations completed successfully.");
} catch (error) {
  console.error("Database migration runner encountered an error:", error);
  process.exitCode = 1;
} finally {
  await client.end();
}
