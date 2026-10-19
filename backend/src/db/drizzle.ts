import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

/**
 * Drizzle client for the endpoints ported off Prisma.
 *
 * Mirrors `db/prisma.ts`: same `DATABASE_URL`, same `pg` driver. Prisma manages
 * connections for everything still on Prisma; this pool serves only the ported
 * queries, so the two never share a connection.
 */
const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ connectionString });

export const db = drizzle(pool, { schema });
