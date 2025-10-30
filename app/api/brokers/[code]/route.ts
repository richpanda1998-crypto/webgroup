import { NextResponse } from "next/server"
import postgres from "postgres"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  console.log("[v0] API /api/brokers/[code] called with code:", code)
  console.log("[v0] Environment check:", {
    hasHost: !!process.env.DB_HOST,
    hasUser: !!process.env.DB_USER,
    hasPassword: !!process.env.DB_PASSWORD,
  })

  const hasDbConfig = process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD

  if (!hasDbConfig) {
    console.log("[v0] Missing database configuration")
    return NextResponse.json({ error: "Broker not found" }, { status: 404 })
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

    console.log("[v0] Executing query for broker:", code)
    // 先尝试通过 code 查询
    let brokers = await sql`
      SELECT * FROM broker_data_web 
      WHERE code = ${code}
      LIMIT 1
    `
    
    // 如果没有找到，尝试通过名称查询（slug 转换为名称）
    if (brokers.length === 0) {
      const nameQuery = code.replace(/-/g, ' ')
      console.log("[v0] Trying to query by name:", nameQuery)
      brokers = await sql`
        SELECT * FROM broker_data_web 
        WHERE LOWER(REPLACE(broker, ' ', '-')) = LOWER(${code})
        LIMIT 1
      `
    }

    console.log("[v0] Query result:", brokers.length > 0 ? "Found broker" : "No broker found")
    await sql.end()

    if (brokers.length === 0) {
      return NextResponse.json({ error: "Broker not found" }, { status: 404 })
    }

    return NextResponse.json(brokers[0])
  } catch (error) {
    console.error("[v0] Database error:", error)
    console.error("[v0] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: "Broker not found" }, { status: 404 })
  }
}
