"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoTooltip } from "@/components/ui/info-tooltip"
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Percent, Wallet, PiggyBank, Info } from "lucide-react"
import { TradeStats } from "@/lib/types"

interface TradingStatsProps {
  stats: TradeStats
}

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  borderColor: string
  valueColor?: string
  explanation: {
    title: string
    description: string
    formula?: string
    interpretation: string
    example?: string
  }
}

function StatCard({ title, value, description, icon, borderColor, valueColor, explanation }: StatCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor} hover:shadow-lg transition-shadow duration-200`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <InfoTooltip explanation={explanation} side="top">
            <button className="opacity-60 hover:opacity-100 transition-opacity cursor-help">
              <Info className="h-3 w-3" />
            </button>
          </InfoTooltip>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor || ''}`}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export function TradingStats({ stats }: TradingStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null || isNaN(value)) {
      return "0.00%"
    }
    return `${value.toFixed(2)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Dana Awal"
        value={formatCurrency(stats.initialCapital)}
        description="Modal trading awal"
        icon={<PiggyBank className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-indigo-500"
        valueColor="text-indigo-600"
        explanation={{
          title: "Dana Awal (Initial Capital)",
          description: "Jumlah uang yang Anda setorkan pertama kali untuk memulai trading. Ini adalah modal dasar sebelum ada aktivitas trading apapun.",
          interpretation: "Semakin besar dana awal, semakin besar potensi profit, tetapi juga risiko yang ditanggung. Pastikan dana ini adalah uang yang siap Anda rugikan.",
          example: "Jika Anda deposit $1000 untuk trading, maka dana awal Anda adalah $1000."
        }}
      />

      <StatCard
        title="Dana Saat Ini"
        value={formatCurrency(stats.currentCapital)}
        description="Modal + P&L"
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-cyan-500"
        valueColor={stats.currentCapital >= stats.initialCapital ? "text-green-600" : "text-red-600"}
        explanation={{
          title: "Dana Saat Ini (Current Capital)",
          description: "Total dana yang Anda miliki saat ini, termasuk dana awal ditambah semua profit/loss dari trading dan penambahan modal.",
          formula: "Dana Awal + Total P&L + Penambahan Modal",
          interpretation: "Jika lebih besar dari dana awal berarti Anda profit, jika lebih kecil berarti loss. Warna hijau = profit, merah = loss.",
          example: "Dana awal $1000, profit $200, penambahan modal $500 = Dana saat ini $1700."
        }}
      />

      <StatCard
        title="Total Return"
        value={formatPercentage(stats.totalReturn)}
        description="Profit dari dana awal"
        icon={<Percent className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-yellow-500"
        valueColor={stats.totalReturn >= 0 ? "text-green-600" : "text-red-600"}
        explanation={{
          title: "Total Return (%)",
          description: "Persentase keuntungan atau kerugian dibandingkan dengan dana awal. Ini menunjukkan seberapa efektif trading Anda.",
          formula: "((Dana Saat Ini - Dana Awal) / Dana Awal) × 100%",
          interpretation: "Positif = profit, negatif = loss. Semakin tinggi persentase, semakin baik performa trading Anda.",
          example: "Dana awal $1000, dana saat ini $1200 = Return 20%."
        }}
      />

      <StatCard
        title="Total P&L"
        value={formatCurrency(stats.totalPnL)}
        description={`${stats.totalTrades} total trades`}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-blue-500"
        valueColor={stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"}
        explanation={{
          title: "Total Profit & Loss",
          description: "Jumlah total keuntungan atau kerugian dari semua aktivitas trading yang telah dilakukan, tidak termasuk penambahan modal.",
          formula: "Σ(Profit dari setiap trade) - Σ(Loss dari setiap trade)",
          interpretation: "Positif = total profit, negatif = total loss. Ini murni hasil dari aktivitas trading saja.",
          example: "10 trades: 6 profit ($300) + 4 loss ($100) = Total P&L +$200."
        }}
      />

      <StatCard
        title="Win Rate"
        value={formatPercentage(stats.winRate)}
        description={`${stats.winningTrades}W / ${stats.losingTrades}L`}
        icon={<Target className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-green-500"
        valueColor="text-green-600"
        explanation={{
          title: "Win Rate (Tingkat Kemenangan)",
          description: "Persentase trade yang menghasilkan profit dibandingkan total trade. Menunjukkan konsistensi strategi trading Anda.",
          formula: "(Jumlah Trade Profit / Total Trade) × 100%",
          interpretation: "50%+ = baik. Namun win rate tinggi tidak selalu berarti profitable jika average loss > average win.",
          example: "10 trades: 7 profit, 3 loss = Win rate 70%."
        }}
      />

      <StatCard
        title="Profit Factor"
        value={stats.profitFactor.toFixed(2)}
        description="Gross profit / Gross loss"
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-purple-500"
        valueColor={stats.profitFactor >= 1 ? "text-green-600" : "text-red-600"}
        explanation={{
          title: "Profit Factor",
          description: "Rasio antara total profit dan total loss. Metrik penting untuk menilai efektivitas strategi trading secara keseluruhan.",
          formula: "Total Gross Profit / Total Gross Loss",
          interpretation: ">1.0 = profitable, <1.0 = loss. Semakin tinggi semakin baik. 1.5+ = sangat baik, 2.0+ = excellent.",
          example: "Total profit $600, total loss $300 = Profit factor 2.0 (sangat baik)."
        }}
      />

      <StatCard
        title="Average Win"
        value={formatCurrency(stats.averageWin)}
        description="Per winning trade"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-emerald-500"
        valueColor="text-green-600"
        explanation={{
          title: "Average Win (Rata-rata Keuntungan)",
          description: "Rata-rata profit yang didapat dari setiap trade yang menguntungkan. Menunjukkan seberapa besar profit typical Anda.",
          formula: "Total Profit dari Winning Trades / Jumlah Winning Trades",
          interpretation: "Semakin besar semakin baik. Idealnya lebih besar dari average loss untuk strategi yang sustainable.",
          example: "5 winning trades: $50, $30, $40, $60, $20 = Average win $40."
        }}
      />

      <StatCard
        title="Average Loss"
        value={formatCurrency(stats.averageLoss)}
        description="Per losing trade"
        icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-red-500"
        valueColor="text-red-600"
        explanation={{
          title: "Average Loss (Rata-rata Kerugian)",
          description: "Rata-rata kerugian dari setiap trade yang loss. Penting untuk risk management dan menentukan position size.",
          formula: "Total Loss dari Losing Trades / Jumlah Losing Trades",
          interpretation: "Semakin kecil semakin baik. Harus dikontrol dengan stop loss yang konsisten sesuai risk management.",
          example: "3 losing trades: -$20, -$15, -$25 = Average loss $20."
        }}
      />

      <StatCard
        title="Max Drawdown"
        value={formatPercentage(stats.maxDrawdown)}
        description="Maximum loss from peak"
        icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
        borderColor="border-l-orange-500"
        valueColor="text-orange-600"
        explanation={{
          title: "Maximum Drawdown",
          description: "Penurunan terbesar dari puncak tertinggi ke titik terendah dalam periode trading. Mengukur risiko maksimum yang pernah dialami.",
          formula: "((Peak Value - Trough Value) / Peak Value) × 100%",
          interpretation: "Semakin kecil semakin baik. <10% = excellent, 10-20% = good, >30% = perlu evaluasi strategi.",
          example: "Modal puncak $1200, turun ke $1000 = Drawdown 16.67%."
        }}
      />
    </div>
  )
}