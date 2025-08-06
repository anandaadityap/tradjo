"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TradeWithPlan, TradeStats } from "@/lib/types"
import { format } from "date-fns"
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from "lucide-react"

interface TradingChartsProps {
  trades: TradeWithPlan[]
  stats: TradeStats
}

export function TradingCharts({ trades, stats }: TradingChartsProps) {
  // Prepare data for equity curve
  const equityCurveData = trades
    .filter(trade => trade.status === 'CLOSED' && trade.pnl !== null)
    .sort((a, b) => new Date(a.exitTime!).getTime() - new Date(b.exitTime!).getTime())
    .reduce((acc, trade, index) => {
      const previousEquity = index === 0 ? stats.initialCapital : acc[index - 1].equity
      const currentEquity = previousEquity + (trade.pnl || 0)
      
      acc.push({
        date: format(new Date(trade.exitTime!), 'MMM dd'),
        equity: currentEquity,
        pnl: trade.pnl || 0,
        symbol: trade.symbol,
        cumulativePnL: acc.length === 0 ? (trade.pnl || 0) : acc[acc.length - 1]?.cumulativePnL + (trade.pnl || 0)
      })
      
      return acc
    }, [] as Array<{
      date: string
      equity: number
      pnl: number
      symbol: string
      cumulativePnL: number
    }>)

  // Prepare data for monthly performance
  const monthlyData = trades
    .filter(trade => trade.status === 'CLOSED' && trade.pnl !== null)
    .reduce((acc, trade) => {
      const month = format(new Date(trade.exitTime!), 'MMM yyyy')
      if (!acc[month]) {
        acc[month] = { month, profit: 0, loss: 0, trades: 0 }
      }
      
      if ((trade.pnl || 0) > 0) {
        acc[month].profit += trade.pnl || 0
      } else {
        acc[month].loss += Math.abs(trade.pnl || 0)
      }
      acc[month].trades += 1
      
      return acc
    }, {} as Record<string, { month: string; profit: number; loss: number; trades: number }>)

  const monthlyPerformance = Object.values(monthlyData).map(data => ({
    ...data,
    netPnL: data.profit - data.loss
  }))

  // Prepare data for win/loss pie chart
  const winLossData = [
    { name: 'Winning Trades', value: stats.winningTrades, color: '#10b981' },
    { name: 'Losing Trades', value: stats.losingTrades, color: '#ef4444' }
  ]

  // Prepare data for daily P&L
  const dailyPnLData = trades
    .filter(trade => trade.status === 'CLOSED' && trade.pnl !== null)
    .map(trade => ({
      date: format(new Date(trade.exitTime!), 'MMM dd'),
      pnl: trade.pnl || 0,
      symbol: trade.symbol,
      type: trade.type
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  interface TooltipProps {
    active?: boolean
    payload?: Array<{
      color: string
      name: string
      value: number
    }>
    label?: string
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="equity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="equity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Equity Curve
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Monthly P&L
          </TabsTrigger>
          <TabsTrigger value="winloss" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Win/Loss Ratio
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Daily P&L
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pertumbuhan modal dari waktu ke waktu
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={equityCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="equity"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    name="Total Equity"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Performa profit/loss per bulan
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  <Bar dataKey="loss" fill="#ef4444" name="Loss" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="winloss" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Win/Loss Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribusi trade menang vs kalah
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={winLossData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent?: number }) => 
                        `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {winLossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ringkasan performa trading
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Trades:</span>
                  <span className="text-sm">{stats.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Win Rate:</span>
                  <span className="text-sm text-green-600">{stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Profit Factor:</span>
                  <span className={`text-sm ${stats.profitFactor >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.profitFactor.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total P&L:</span>
                  <span className={`text-sm font-medium ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(stats.totalPnL)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Average Win:</span>
                  <span className="text-sm text-green-600">{formatCurrency(stats.averageWin)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Average Loss:</span>
                  <span className="text-sm text-red-600">{formatCurrency(stats.averageLoss)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily P&L</CardTitle>
              <p className="text-sm text-muted-foreground">
                Profit/Loss harian dari setiap trade
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyPnLData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'P&L']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar 
                    dataKey="pnl" 
                    name="P&L"
                  >
                    {dailyPnLData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}