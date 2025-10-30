import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Plus, Minus } from "lucide-react"
import type { ProsAndCons } from "@/lib/types"

interface ProsConsSectionProps {
  data: ProsAndCons | null
}

export function ProsConsSection({ data }: ProsConsSectionProps) {
  const hasData = data && (data.pros?.length > 0 || data.cons?.length > 0)

  return (
    <Card className={!hasData ? "border-dashed" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="size-5" />
          Pros & Cons
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pros */}
            {data.pros && data.pros.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-success">
                  <Plus className="size-4" />
                  Advantages
                </h4>
                <ul className="space-y-2">
                  {data.pros.map((pro, index) => (
                    <li key={index} className="flex gap-2 text-sm">
                      <span className="text-success">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {data.cons && data.cons.length > 0 && (
              <div>
                <h4 className="mb-3 flex items-center gap-2 font-semibold text-destructive">
                  <Minus className="size-4" />
                  Disadvantages
                </h4>
                <ul className="space-y-2">
                  {data.cons.map((con, index) => (
                    <li key={index} className="flex gap-2 text-sm">
                      <span className="text-destructive">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <List className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Detailed advantages and disadvantages of this broker will be displayed here.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Content will be added soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
