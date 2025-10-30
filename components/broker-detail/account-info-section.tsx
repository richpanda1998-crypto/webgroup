import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, DollarSign, BarChart3 } from "lucide-react"
import type { BrokerParsed } from "@/lib/types"

interface AccountInfoSectionProps {
  broker: BrokerParsed
}

interface AccountType {
  account_type: string
  is_visible: boolean
  is_active: boolean
  data: Record<string, any>
}

function parseAccountInfo(accountInfoStr: string): AccountType[] | null {
  try {
    const parsed = JSON.parse(accountInfoStr)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (value === '--' || value === '') {
    return 'N/A'
  }
  return String(value)
}

function getFieldLabel(key: string): string {
  const labels: Record<string, string> = {
    'Environment': '交易环境',
    'Currency': '账户货币',
    'Maximum Leverage': '最大杠杆',
    'SupportedEA': '支持EA',
    'Minimum Deposit': '最小入金',
    'Minimum Spread': '最小点差',
    'Depositing Method': '入金方式',
    'Withdrawal Method': '出金方式',
    'Minimum Position': '最小交易量',
    'Commission': '佣金',
    'Products': '交易产品',
  }
  return labels[key] || key
}

export function AccountInfoSection({ broker }: AccountInfoSectionProps) {
  const hasAccountInfoStr = broker.account_info && broker.account_info.trim() !== ""
  const accounts = hasAccountInfoStr ? parseAccountInfo(broker.account_info) : null
  const visibleAccounts = accounts?.filter(acc => acc.is_visible) || []
  const hasValidAccounts = visibleAccounts.length > 0

  // 合并所有账户的数据字段
  const allFields = new Map<string, any>()
  visibleAccounts.forEach(account => {
    Object.entries(account.data).forEach(([key, value]) => {
      if (value && value !== '--' && value !== '') {
        allFields.set(key, value)
      }
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="size-5" />
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasValidAccounts ? (
          <div className="space-y-4">
            {/* 显示提供的账户类型 */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Wallet className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">提供账户类型</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleAccounts.map((account) => (
                  <Badge key={account.account_type} variant="secondary" className="text-xs">
                    {account.account_type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 合并显示所有字段 */}
            <div className="grid gap-3">
              {Array.from(allFields.entries()).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-4 rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-2">
                    {key === 'Maximum Leverage' && <TrendingUp className="size-4 text-muted-foreground" />}
                    {key === 'Minimum Deposit' && <DollarSign className="size-4 text-muted-foreground" />}
                    {key === 'Products' && <BarChart3 className="size-4 text-muted-foreground" />}
                    <span className="text-sm font-medium text-muted-foreground">{getFieldLabel(key)}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground text-right max-w-[60%] break-words">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No account information available at this time.</p>
        )}
      </CardContent>
    </Card>
  )
}
