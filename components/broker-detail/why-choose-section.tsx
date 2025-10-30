import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, CheckCircle2 } from "lucide-react"
import type { WhyChoose } from "@/lib/types"

interface WhyChooseSectionProps {
  data: WhyChoose[] | null
}

export function WhyChooseSection({ data }: WhyChooseSectionProps) {
  const hasData = data && data.length > 0

  return (
    <Card className={!hasData ? "border-dashed" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="size-5" />
          Why Choose This Broker
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <Target className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Detailed reasons and benefits for choosing this broker will be displayed here.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Content will be added soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
