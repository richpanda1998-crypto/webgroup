import type { Broker } from "./types"

export async function getAllBrokersFromDB(): Promise<Broker[]> {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
        : ""

    const response = await fetch(`${baseUrl}/api/brokers`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    return []
  }
}

export async function getBrokerByCodeFromDB(code: string): Promise<Broker | null> {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
        : ""

    const response = await fetch(`${baseUrl}/api/brokers/${code}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    return null
  }
}

export async function getBrokerByNameFromDB(name: string): Promise<Broker | null> {
  // 名称转 slug后查询
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  
  return getBrokerByCodeFromDB(slug)
}
