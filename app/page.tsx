import Link from "next/link"
import { getAllBrokers } from "./actions/brokers"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, TrendingUp, Shield, Zap, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BrokerRankingCard } from "@/components/home/broker-ranking-card"
import { BrokerCarousel } from "@/components/home/broker-carousel"
import { getLicenseDisplay } from "@/lib/license-parser"
import { sortByRegulation, sortByScore, sortByExperience, getRiskyBrokers } from "@/lib/broker-sort"
import { RiskyBrokersSection } from "@/components/home/risky-brokers-section"

export const metadata = {
  title: "Forex Broker Reviews - Compare Top Trading Platforms | Zenpro FX",
  description:
    "Zenpro FX: Compare and review top forex brokers. Read detailed reviews covering licenses, spreads, leverage, and user feedback. Find legitimate brokers and avoid scams.",
}

export default async function HomePage() {
  const brokers = await getAllBrokers()

  const topBrokers = sortByScore(brokers).slice(0, 10)
  const licensedBrokers = brokers.filter((b) => b.license_info && b.license_info.trim() !== "")
  const bestRegulatedBrokers = sortByRegulation(licensedBrokers).slice(0, 5)
  const highestRatedBrokers = sortByScore(brokers).slice(0, 5)
  const mostExperiencedBrokers = sortByExperience(brokers).slice(0, 5)
  const riskyBrokers = getRiskyBrokers(brokers, 8)

  const isPreviewWithNoData = brokers.length === 0 && typeof window === "undefined"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Find Your Perfect Forex Broker</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Compare top-rated brokers, check licenses, and read reviews
            </p>
            <form action="/search" method="GET" className="flex gap-2">
              <Input
                type="search"
                name="q"
                placeholder="Search brokers by name..."
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" className="gap-2">
                <Search className="size-4" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isPreviewWithNoData ? (
          <div className="mx-auto max-w-2xl rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="size-8 text-primary" />
              </div>
            </div>
            <h2 className="mb-2 text-xl font-bold">数据库连接仅在部署后可用</h2>
            <p className="mb-6 text-muted-foreground">
              v0预览环境不支持PostgreSQL连接。请访问您的Vercel部署网站查看真实的交易商数据。
            </p>
            <div className="rounded-lg bg-background p-4 text-left">
              <p className="mb-2 text-sm font-semibold">如何查看您的数据：</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. 点击右上角的 "Publish" 按钮部署到Vercel（如果还没部署）</li>
                <li>2. 部署完成后，访问您的Vercel项目URL</li>
                <li>3. 确保在Vercel项目设置中配置了数据库环境变量</li>
              </ol>
            </div>
          </div>
        ) : (
          <>
            {/* Top Rated Brokers Carousel */}
            <section className="mb-16">
              <div className="mb-8 flex items-center gap-2">
                <Award className="size-6 text-primary" />
                <h2 className="text-3xl font-bold">Top Rated Brokers</h2>
              </div>

              {topBrokers.length > 0 ? (
                <BrokerCarousel brokers={topBrokers} />
              ) : (
                <div className="rounded-lg border bg-card p-12 text-center">
                  <p className="text-muted-foreground">暂无交易商数据</p>
                </div>
              )}
            </section>

            {/* Broker Rankings */}
            <section className="mb-12">
              <div className="mb-8 flex items-center gap-2">
                <TrendingUp className="size-6 text-primary" />
                <h2 className="text-3xl font-bold">Broker Rankings</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Best Regulated */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-6 flex items-center gap-2">
                    <Shield className="size-5 text-success" />
                    <h3 className="text-lg font-semibold">Best Regulated</h3>
                  </div>
                  <div className="space-y-4">
                    {bestRegulatedBrokers.map((broker, idx) => (
                      <Link key={broker.code} href={`/broker/${broker.code}`} className="group">
                        <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold group-hover:text-primary">{broker.broker}</p>
                            <p className="truncate text-xs text-muted-foreground">{getLicenseDisplay(broker.license_info)}</p>
                          </div>
                          <span className="flex-shrink-0 text-lg font-bold text-success">{broker.total_score.toFixed(1)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Highest Rated */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-6 flex items-center gap-2">
                    <Zap className="size-5 text-warning" />
                    <h3 className="text-lg font-semibold">Highest Rated</h3>
                  </div>
                  <div className="space-y-4">
                    {highestRatedBrokers.map((broker, idx) => (
                      <Link key={broker.code} href={`/broker/${broker.code}`} className="group">
                        <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold group-hover:text-primary">{broker.broker}</p>
                            <p className="text-xs text-muted-foreground">{broker.register_country}</p>
                          </div>
                          <span className="flex-shrink-0 text-lg font-bold text-warning">{broker.total_score.toFixed(1)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Most Experienced */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="mb-6 flex items-center gap-2">
                    <TrendingUp className="size-5 text-accent" />
                    <h3 className="text-lg font-semibold">Most Experienced</h3>
                  </div>
                  <div className="space-y-4">
                    {mostExperiencedBrokers.map((broker, idx) => (
                      <Link key={broker.code} href={`/broker/${broker.code}`} className="group">
                        <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted">
                          <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold group-hover:text-primary">{broker.broker}</p>
                            <p className="text-xs text-muted-foreground">{broker.operating_period}</p>
                          </div>
                          <span className="flex-shrink-0 text-lg font-bold text-accent">{broker.total_score.toFixed(1)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Warning Section */}
            {riskyBrokers.length > 0 && (
              <section className="mb-12">
                <RiskyBrokersSection brokers={riskyBrokers} />
              </section>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
