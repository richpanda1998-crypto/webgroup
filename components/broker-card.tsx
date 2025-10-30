import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, AlertTriangle, ExternalLink } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface BrokerCardProps {
  broker: BrokerParsed
}

export function BrokerCard({ broker }: BrokerCardProps) {
  const hasLicense = broker.license_info && broker.license_info.trim() !== ""
  const scoreColor =
    broker.total_score >= 8 ? "text-success" : broker.total_score >= 6 ? "text-warning" : "text-destructive"

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardContent className="flex-1 p-6">
        {/* Header with Logo and Score */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {broker.logo ? (
              <div className="relative size-12 overflow-hidden rounded-lg border bg-white">
                <Image
                  src={broker.logo || "/placeholder.svg"}
                  alt={`${broker.broker} logo`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ) : (
              <div className="flex size-12 items-center justify-center rounded-lg border bg-muted">
                <span className="text-lg font-bold text-muted-foreground">{broker.broker.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold leading-tight">{broker.broker}</h3>
              <p className="text-xs text-muted-foreground">{broker.register_country}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 text-2xl font-bold ${scoreColor}`}>
              <Star className="size-5 fill-current" />
              {broker.total_score.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* License Status */}
        <div className="mb-4">
          {hasLicense ? (
            <Badge variant="outline" className="gap-1 border-success text-success">
              <Shield className="size-3" />
              Licensed
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 border-destructive text-destructive">
              <AlertTriangle className="size-3" />
              No License Info
            </Badge>
          )}
        </div>

        {/* Key Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Operating Period:</span>
            <span className="font-medium">{broker.operating_period || "N/A"}</span>
          </div>
          {broker.license_info && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">License:</span>
              <span className="truncate pl-2 text-right font-medium" title={broker.license_info}>
                {broker.license_info.length > 20 ? `${broker.license_info.substring(0, 20)}...` : broker.license_info}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 border-t p-4">
        <Button asChild variant="outline" className="flex-1 bg-transparent" size="sm">
          <Link href={`/broker/${broker.broker.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`}>View Details</Link>
        </Button>
        <Button asChild className="flex-1" size="sm">
          <a href={broker.official_link} target="_blank" rel="noopener noreferrer">
            Visit Website
            <ExternalLink className="ml-1 size-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
