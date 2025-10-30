import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle2, FileText } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface LicenseSectionProps {
  broker: BrokerParsed
}

interface LicenseInfo {
  监管状态: string
  牌照信息: string
}

function parseLicenseInfo(licenseStr: string): LicenseInfo[] | null {
  try {
    const parsed = JSON.parse(licenseStr)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function LicenseSection({ broker }: LicenseSectionProps) {
  const hasLicenseStr = broker.license_info && broker.license_info.trim() !== ""
  const licenses = hasLicenseStr ? parseLicenseInfo(broker.license_info) : null
  const hasValidLicense = licenses && licenses.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="size-5" />
          Regulatory License
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasValidLicense ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3">
              <CheckCircle2 className="size-5 text-success" />
              <span className="font-semibold text-success">Licensed Broker</span>
              <Badge variant="outline" className="ml-auto border-success/30 text-success">{licenses.length}</Badge>
            </div>
            
            <div className="grid gap-3">
              {licenses.map((license, index) => (
                <div key={index} className="group rounded-lg border bg-card p-4 transition-all hover:border-success/30 hover:shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <p className="font-medium leading-tight text-foreground">{license.牌照信息}</p>
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-success"></div>
                        <span className="text-sm text-muted-foreground">{license.监管状态}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>警告：暂未查证到有效监管信息</AlertTitle>
            <AlertDescription className="mt-2">
              暂未查证到有效监管信息，请注意风险！
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
