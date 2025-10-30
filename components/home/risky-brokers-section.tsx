import Link from "next/link"
import Image from "next/image"
import { AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { BrokerParsed } from "@/lib/types"

interface RiskyBrokersSectionProps {
  brokers: BrokerParsed[]
}

function brokerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function RiskyBrokersSection({ brokers }: RiskyBrokersSectionProps) {
  if (brokers.length === 0) return null

  return (
    <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-destructive">⚠️ Risk Warning</h3>
          <p className="text-sm text-muted-foreground">
            These brokers have low ratings, lack proper licenses, or have regulatory concerns. Trade with caution.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brokers.map((broker) => {
          const brokerSlug = brokerNameToSlug(broker.broker)
          const hasLicense = broker.license_info && broker.license_info.trim() !== ""
          const lowScore = broker.total_score < 5

          return (
            <Link key={broker.code} href={`/broker/${brokerSlug}`}>
              <Card className="flex h-full flex-col items-center justify-between gap-3 p-4 transition-all hover:shadow-lg hover:border-destructive/50 cursor-pointer">
                {/* Logo */}
                {broker.logo ? (
                  <div className="relative size-12 overflow-hidden rounded-lg bg-white">
                    <Image
                      src={broker.logo || "/placeholder.svg"}
                      alt={`${broker.broker} logo`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <span className="text-sm font-bold text-muted-foreground">{broker.broker.charAt(0)}</span>
                  </div>
                )}

                {/* Broker Name */}
                <div className="text-center">
                  <p className="text-sm font-semibold leading-tight line-clamp-2">{broker.broker}</p>
                </div>

                {/* Risk Indicators */}
                <div className="w-full space-y-2 text-xs">
                  {lowScore && (
                    <div className="flex items-center justify-center gap-1 rounded bg-destructive/10 px-2 py-1 text-destructive">
                      <AlertTriangle className="size-3" />
                      <span>Low Score: {broker.total_score.toFixed(1)}</span>
                    </div>
                  )}
                  {!hasLicense && (
                    <div className="flex items-center justify-center gap-1 rounded bg-destructive/10 px-2 py-1 text-destructive">
                      <AlertTriangle className="size-3" />
                      <span>Unlicensed</span>
                    </div>
                  )}
                  {hasLicense && !lowScore && (
                    <div className="flex items-center justify-center gap-1 rounded bg-yellow-50 px-2 py-1 text-yellow-700">
                      <AlertTriangle className="size-3" />
                      <span>Review Carefully</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
