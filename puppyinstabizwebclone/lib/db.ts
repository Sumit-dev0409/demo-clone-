import { Pool } from "pg";

const poolKey = Symbol.for("teddypups.postgres.pool");
const failureKey = Symbol.for("teddypups.postgres.last_failure");

type PoolGlobal = typeof globalThis & {
  [poolKey]?: Pool;
  [failureKey]?: number;
};

/**
 * Returns true if the database was recently unreachable (circuit breaker).
 * Avoids 5-second socket timeout delays on every request when Postgres is stopped.
 */
export function isDbCircuitOpen(): boolean {
  const globalWithPool = globalThis as PoolGlobal;
  const lastFailure = globalWithPool[failureKey];
  if (lastFailure && Date.now() - lastFailure < 10000) {
    return true; // Circuit open: skip trying for 10 seconds
  }
  return false;
}

export function recordDbFailure(): void {
  const globalWithPool = globalThis as PoolGlobal;
  globalWithPool[failureKey] = Date.now();
}

export function resetDbCircuit(): void {
  const globalWithPool = globalThis as PoolGlobal;
  globalWithPool[failureKey] = undefined;
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const globalWithPool = globalThis as PoolGlobal;
  if (!globalWithPool[poolKey]) {
    globalWithPool[poolKey] = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      connectionTimeoutMillis: 1000, // 1s timeout instead of 5s
      idleTimeoutMillis: 30000,
    });
  }
  return globalWithPool[poolKey]!;
}
