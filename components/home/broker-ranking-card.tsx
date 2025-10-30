import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { BrokerRiskBadge } from "@/components/broker-risk-badge"
import type { BrokerParsed } from "@/lib/types"

interface BrokerRankingCardProps {
  broker: BrokerParsed
}

function brokerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function BrokerRankingCard({ broker }: BrokerRankingCardProps) {
  const brokerSlug = brokerNameToSlug(broker.broker)
  return (
    <Link href={`/broker/${brokerSlug}`}>
      <Card className="flex w-40 flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-3 p-4 transition-all hover:shadow-lg hover:scale-105">
        {broker.logo ? (
          <div className="relative size-16 overflow-hidden rounded-lg bg-white">
            <Image
              src={broker.logo || "/placeholder.svg"}
              alt={`${broker.broker} logo`}
              fill
              className="object-contain p-1"
            />
          </div>
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted">
            <span className="text-2xl font-bold text-muted-foreground">{broker.broker.charAt(0)}</span>
          </div>
        )}
        <div className="text-center">
          <p className="text-sm font-semibold leading-tight">{broker.broker}</p>
        </div>
        <BrokerRiskBadge broker={broker} />
      </Card>
    </Link>
  )
}
