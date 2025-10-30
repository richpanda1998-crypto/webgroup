import { NextResponse } from "next/server"
import postgres from "postgres"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  console.log("[v0] API /api/brokers called")
  console.log("[v0] Environment check:", {
    hasHost: !!process.env.DB_HOST,
    hasUser: !!process.env.DB_USER,
    hasPassword: !!process.env.DB_PASSWORD,
    hasName: !!process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  })

  const hasDbConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD

  if (!hasDbConfig) {
    console.log("[v0] Missing database configuration")
    return NextResponse.json([])
  }

  try {
    console.log("[v0] Creating database connection...")
    const sql = postgres({
      host: process.env.DB_HOST!,
      port: Number.parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    })

    console.log("[v0] Executing query on broker_data_web table...")
    const brokers = await sql`
      SELECT * FROM broker_data_web 
      ORDER BY total_score DESC NULLS LAST
    `

    console.log("[v0] Query successful, found", brokers.length, "brokers")
    await sql.end()
    return NextResponse.json(brokers)
  } catch (error) {
    console.error("[v0] Database error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json([])
  }
}
