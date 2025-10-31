import { notFound } from "next/navigation"
import { getBrokerByCode } from "@/app/actions/brokers"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BrokerHeader } from "@/components/broker-detail/broker-header"
import { LicenseSection } from "@/components/broker-detail/license-section"
import { AccountInfoSection } from "@/components/broker-detail/account-info-section"
import { OperatingDetailsSection } from "@/components/broker-detail/operating-details-section"
import { WhyChooseSection } from "@/components/broker-detail/why-choose-section"
import { SafetySection } from "@/components/broker-detail/safety-section"
import { ProsConsSection } from "@/components/broker-detail/pros-cons-section"
import { FAQSection } from "@/components/broker-detail/faq-section"
import type { Metadata } from "next"

interface BrokerPageProps {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: BrokerPageProps): Promise<Metadata> {
  const { name } = await params
  const broker = await getBrokerByCode(name)

  if (!broker) {
    return {
      title: "Broker Not Found",
    }
  }

  const siteName = "Zenpro FX" // 网站名称，后续可以从环境变量读取
  
  return {
    title: `${broker.broker} Review, Forex Broker&Trading Markets, Legit or a Scam-${siteName}`,
    description: `${siteName}: ${broker.broker} review, covering licenses, user reviews, forex spreads, leverage, Is ${broker.broker} a scam or legit broker, Read ${siteName} review before start trading.`,
  }
}

export default async function BrokerPage({ params }: BrokerPageProps) {
  const { name } = await params
  const broker = await getBrokerByCode(name)

  if (!broker) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <BrokerHeader broker={broker} />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            <LicenseSection broker={broker} />
            <AccountInfoSection broker={broker} />
            <WhyChooseSection data={broker.whychose} />
            <SafetySection data={broker.safe} />
            <ProsConsSection data={broker.pros} />
            <FAQSection data={broker.faq} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OperatingDetailsSection broker={broker} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
