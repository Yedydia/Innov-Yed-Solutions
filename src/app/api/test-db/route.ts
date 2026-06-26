import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json({ error: "DATABASE_URL is undefined", nodeEnv: process.env.NODE_ENV }, { status: 500 });
  }

  try {
    const masked = url.substring(0, 35) + "...[hidden]";
    const { Pool } = await import("pg");
    const pool = new Pool({ connectionString: url, connectionTimeoutMillis: 10000 });
    const result = await pool.query("SELECT 1 as test, current_database() as db");
    await pool.end();
    return NextResponse.json({ ok: true, preview: masked, result: result.rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
