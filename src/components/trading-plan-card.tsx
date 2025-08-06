"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, DollarSign, TrendingUp, Settings, PiggyBank } from "lucide-react"
import { TradingPlanWithTrades } from "@/lib/types"

interface TradingPlanCardProps {
  plan: TradingPlanWithTrades
  onEdit?: (plan: TradingPlanWithTrades) => void
}

export function TradingPlanCard({ plan, onEdit }: TradingPlanCardProps) {
  const activeTrades = plan.trades.filter(trade => trade.status === "OPEN").length
  const totalTrades = plan.trades.length
  const totalPnL = plan.trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  const totalReturn = plan.initialCapital > 0 ? (totalPnL / plan.initialCapital) * 100 : 0

  return (
    <Card className={`transition-all hover:shadow-md ${plan.isActive ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{plan.name}</CardTitle>
            {plan.isActive && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(plan)}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        {plan.description && (
          <CardDescription className="text-sm">
            {plan.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Management */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-indigo-600" />
            <div>
              <p className="text-xs font-medium">Dana Awal</p>
              <p className="text-sm font-bold text-indigo-600">${plan.initialCapital}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs font-medium">Risk:Reward</p>
              <p className="text-sm font-bold text-blue-600">1:{plan.riskRewardRatio}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs font-medium">Max Loss</p>
              <p className="text-sm font-bold text-red-600">${plan.maxLossAmount}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Total Trades</p>
              <p className="text-sm font-semibold">{totalTrades}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-sm font-semibold text-blue-600">{activeTrades}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total P&L</p>
              <p className={`text-sm font-semibold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalPnL.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Return %</p>
              <p className={`text-sm font-semibold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturn.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Performance Indicator */}
        {totalTrades > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <TrendingUp className={`h-4 w-4 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnL >= 0 ? 'Profitable' : 'Losing'} Plan
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}