"use server"

import { getAllBrokersFromDB, getBrokerByCodeFromDB } from "@/lib/db"
import type { BrokerParsed } from "@/lib/types"

function parseBrokerData(broker: any): BrokerParsed {
  return {
    ...broker,
    whychose: broker.whychose ? tryParseJSON(broker.whychose) : null,
    safe: broker.safe ? tryParseJSON(broker.safe) : null,
    pros: broker.pros ? tryParseJSON(broker.pros) : null,
    faq: broker.faq ? tryParseJSON(broker.faq) : null,
  }
}

function tryParseJSON(text: string): any {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function getAllBrokers(): Promise<BrokerParsed[]> {
  try {
    const brokers = await getAllBrokersFromDB()
    return brokers.map(parseBrokerData)
  } catch (error) {
    console.error("[v0] Error fetching brokers:", error)
    return []
  }
}

export async function getBrokerByCode(code: string): Promise<BrokerParsed | null> {
  try {
    const broker = await getBrokerByCodeFromDB(code)
    return broker ? parseBrokerData(broker) : null
  } catch (error) {
    console.error("[v0] Error fetching broker:", error)
    return null
  }
}
