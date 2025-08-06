"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TradingStats } from "@/components/trading-stats"
import { TradesTable } from "@/components/trades-table"
import { AddTradeForm } from "@/components/add-trade-form"
import { TradingPlanCard } from "@/components/trading-plan-card"
import { BarChart3, TrendingUp, Plus, Target } from "lucide-react"
import { 
  TradeWithPlan, 
  TradingPlanWithTrades, 
  CreateTradeInput, 
  TradeStats as TradeStatsType,
  TradeStatus 
} from "@/lib/types"

// Mock data untuk demo
const mockTradingPlans: TradingPlanWithTrades[] = [
  {
    id: "1",
    name: "Conservative Strategy",
    description: "Low risk, steady gains with 1:2 risk-reward ratio",
    riskRewardRatio: 2.0,
    maxLossAmount: 2.0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    trades: []
  },
  {
    id: "2", 
    name: "Aggressive Growth",
    description: "Higher risk for potentially higher returns",
    riskRewardRatio: 3.0,
    maxLossAmount: 5.0,
    isActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    trades: []
  }
]

const mockTrades: TradeWithPlan[] = [
  {
    id: "1",
    symbol: "EURUSD",
    type: "BUY",
    status: "CLOSED" as TradeStatus,
    entryPrice: 1.0850,
    entryTime: new Date("2024-01-15T10:30:00"),
    quantity: 10000,
    exitPrice: 1.0890,
    exitTime: new Date("2024-01-15T14:20:00"),
    stopLoss: 1.0830,
    takeProfit: 1.0890,
    riskAmount: 20,
    rewardAmount: 40,
    pnl: 40,
    pnlPercentage: 0.37,
    notes: "Clean breakout above resistance",
    screenshot: null,
    tags: ["breakout", "trend"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0]
  },
  {
    id: "2",
    symbol: "GBPUSD",
    type: "SELL",
    status: "CLOSED" as TradeStatus,
    entryPrice: 1.2650,
    entryTime: new Date("2024-01-16T08:15:00"),
    quantity: 5000,
    exitPrice: 1.2670,
    exitTime: new Date("2024-01-16T11:45:00"),
    stopLoss: 1.2670,
    takeProfit: 1.2610,
    riskAmount: 10,
    rewardAmount: 20,
    pnl: -10,
    pnlPercentage: -0.16,
    notes: "False breakdown, stopped out",
    screenshot: null,
    tags: ["breakdown", "failed"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0]
  },
  {
    id: "3",
    symbol: "BTCUSD",
    type: "BUY",
    status: "OPEN" as TradeStatus,
    entryPrice: 42500,
    entryTime: new Date("2024-01-17T09:00:00"),
    quantity: 0.1,
    exitPrice: null,
    exitTime: null,
    stopLoss: 41500,
    takeProfit: 44500,
    riskAmount: 100,
    rewardAmount: 200,
    pnl: null,
    pnlPercentage: null,
    notes: "Support level hold, expecting bounce",
    screenshot: null,
    tags: ["support", "crypto"],
    createdAt: new Date(),
    updatedAt: new Date(),
    tradingPlanId: "1",
    tradingPlan: mockTradingPlans[0]
  }
]

export default function Home() {
  const [trades, setTrades] = useState<TradeWithPlan[]>(mockTrades)
  const [tradingPlans] = useState<TradingPlanWithTrades[]>(mockTradingPlans)
  const [stats, setStats] = useState<TradeStatsType>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnL: 0,
    averageWin: 0,
    averageLoss: 0,
    profitFactor: 0,
    maxDrawdown: 0
  })

  // Calculate statistics
  useEffect(() => {
    const closedTrades = trades.filter(trade => trade.status === "CLOSED" && trade.pnl !== null)
    const winningTrades = closedTrades.filter(trade => trade.pnl! > 0)
    const losingTrades = closedTrades.filter(trade => trade.pnl! < 0)
    
    const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl!, 0)
    const grossProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl!, 0)
    const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl!, 0))
    
    const newStats: TradeStatsType = {
      totalTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
      totalPnL,
      averageWin: winningTrades.length > 0 ? grossProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? grossLoss / losingTrades.length : 0,
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0,
      maxDrawdown: 0 // Simplified for demo
    }
    
    setStats(newStats)
  }, [trades])

  const handleAddTrade = (tradeInput: CreateTradeInput) => {
    const newTrade: TradeWithPlan = {
      id: Date.now().toString(),
      ...tradeInput,
      notes: tradeInput.notes || null,
      tags: tradeInput.tags || [],
      status: "PENDING" as TradeStatus,
      entryTime: new Date(),
      pnl: null,
      pnlPercentage: null,
      exitPrice: null,
      exitTime: null,
      screenshot: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tradingPlan: tradingPlans.find(plan => plan.id === tradeInput.tradingPlanId)!
    }
    
    setTrades(prev => [newTrade, ...prev])
  }

  const handleEditTrade = (trade: TradeWithPlan) => {
    // TODO: Implement edit functionality
    console.log("Edit trade:", trade)
  }

  const handleDeleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== tradeId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Trading Journal</h1>
          </div>
          <p className="text-gray-600">
            Track your trades, analyze performance, and improve your trading strategy
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <TradingStats stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Trades</CardTitle>
                      <CardDescription>Your latest trading activity</CardDescription>
                    </div>
                    <AddTradeForm 
                      tradingPlans={tradingPlans} 
                      onAddTrade={handleAddTrade}
                    />
                  </CardHeader>
                  <CardContent>
                    <TradesTable 
                      trades={trades.slice(0, 5)} 
                      onEditTrade={handleEditTrade}
                      onDeleteTrade={handleDeleteTrade}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Active Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tradingPlans.find(plan => plan.isActive) ? (
                      <TradingPlanCard 
                        plan={tradingPlans.find(plan => plan.isActive)!} 
                      />
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No active trading plan
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Trades Tab */}
          <TabsContent value="trades" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>All Trades</CardTitle>
                  <CardDescription>Complete history of your trades</CardDescription>
                </div>
                <AddTradeForm 
                  tradingPlans={tradingPlans} 
                  onAddTrade={handleAddTrade}
                />
              </CardHeader>
              <CardContent>
                <TradesTable 
                  trades={trades} 
                  onEditTrade={handleEditTrade}
                  onDeleteTrade={handleDeleteTrade}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Trading Plans</h2>
                <p className="text-muted-foreground">Manage your trading strategies</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tradingPlans.map((plan) => (
                <TradingPlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Detailed analysis of your trading performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TradingStats stats={stats} />
                <div className="mt-6 text-center text-muted-foreground">
                  <p>Advanced analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
