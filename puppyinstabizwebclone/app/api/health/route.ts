import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        status: "degraded",
        database: "unconfigured",
        message: "DATABASE_URL is not set.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  const start = performance.now();
  try {
    const pool = getPool();
    const dbResult = await pool.query<{ now: Date }>("SELECT NOW() AS now");

    let migrationsCount = 0;
    try {
      const migResult = await pool.query<{ count: string }>(
        "SELECT COUNT(*) as count FROM schema_migrations",
      );
      migrationsCount = parseInt(migResult.rows[0].count, 10);
    } catch {
      // Table may not exist yet before first migration
    }

    const latencyMs = Math.round((performance.now() - start) * 10) / 10;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      latency_ms: latencyMs,
      db_time: dbResult.rows[0].now,
      migrations_applied: migrationsCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const latencyMs = Math.round((performance.now() - start) * 10) / 10;
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "unavailable",
        database: "unreachable",
        latency_ms: latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
