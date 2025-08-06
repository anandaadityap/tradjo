"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Percent, Wallet, PiggyBank } from "lucide-react"
import { TradeStats } from "@/lib/types"

interface TradingStatsProps {
  stats: TradeStats
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
      {/* Initial Capital */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dana Awal</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">
            {formatCurrency(stats.initialCapital)}
          </div>
          <p className="text-xs text-muted-foreground">
            Modal trading awal
          </p>
        </CardContent>
      </Card>

      {/* Current Capital */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dana Saat Ini</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={stats.currentCapital >= stats.initialCapital ? "text-green-600" : "text-red-600"}>
              {formatCurrency(stats.currentCapital)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Modal + P&L
          </p>
        </CardContent>
      </Card>

      {/* Total Return */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Return</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={stats.totalReturn >= 0 ? "text-green-600" : "text-red-600"}>
              {formatPercentage(stats.totalReturn)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Profit dari dana awal
          </p>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={stats.totalPnL >= 0 ? "text-green-600" : "text-red-600"}>
              {formatCurrency(stats.totalPnL)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalTrades} total trades
          </p>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatPercentage(stats.winRate)}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.winningTrades}W / {stats.losingTrades}L
          </p>
        </CardContent>
      </Card>

      {/* Profit Factor */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={stats.profitFactor >= 1 ? "text-green-600" : "text-red-600"}>
              {stats.profitFactor.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Gross profit / Gross loss
          </p>
        </CardContent>
      </Card>

      {/* Average Win */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Win</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.averageWin)}
          </div>
          <p className="text-xs text-muted-foreground">
            Per winning trade
          </p>
        </CardContent>
      </Card>

      {/* Average Loss */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Loss</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.averageLoss)}
          </div>
          <p className="text-xs text-muted-foreground">
            Per losing trade
          </p>
        </CardContent>
      </Card>

      {/* Max Drawdown */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatPercentage(stats.maxDrawdown)}
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum loss from peak
          </p>
        </CardContent>
      </Card>
    </div>
  )
}