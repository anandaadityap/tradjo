import { prisma } from './prisma'
import {
  CreateTradeInput,
  UpdateTradeInput,
  CreateTradingPlanInput,
  UpdateTradingPlanInput,
  TradeWithPlan,
  TradingPlanWithTrades,
  TradeStats,
  TradeStatus
} from './types'

// Trading Plan Services
export async function createTradingPlan(data: CreateTradingPlanInput): Promise<TradingPlanWithTrades> {
  return await prisma.tradingPlan.create({
    data: {
      name: data.name,
      description: data.description,
      riskRewardRatio: data.riskRewardRatio || 2.0,
      maxLossAmount: data.maxLossAmount || 2.0,
      initialCapital: data.initialCapital || 1000.0,
    },
    include: {
      trades: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export async function getTradingPlans(): Promise<TradingPlanWithTrades[]> {
  return await prisma.tradingPlan.findMany({
    include: {
      trades: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getTradingPlanById(id: string): Promise<TradingPlanWithTrades | null> {
  return await prisma.tradingPlan.findUnique({
    where: { id },
    include: {
      trades: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export async function updateTradingPlan(data: UpdateTradingPlanInput) {
  const { id, ...updateData } = data
  return await prisma.tradingPlan.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteTradingPlan(id: string) {
  return await prisma.tradingPlan.delete({
    where: { id },
  })
}

// Trade Services
export async function createTrade(data: CreateTradeInput) {
  return await prisma.trade.create({
    data,
    include: {
      tradingPlan: true,
    },
  })
}

export async function getTrades(): Promise<TradeWithPlan[]> {
  return await prisma.trade.findMany({
    include: {
      tradingPlan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getTradeById(id: string): Promise<TradeWithPlan | null> {
  return await prisma.trade.findUnique({
    where: { id },
    include: {
      tradingPlan: true,
    },
  })
}

export async function updateTrade(data: UpdateTradeInput) {
  const { id, ...updateData } = data
  return await prisma.trade.update({
    where: { id },
    data: updateData,
    include: {
      tradingPlan: true,
    },
  })
}

export async function deleteTrade(id: string) {
  return await prisma.trade.delete({
    where: { id },
  })
}

export async function getTradesByPlan(tradingPlanId: string): Promise<TradeWithPlan[]> {
  return await prisma.trade.findMany({
    where: { tradingPlanId },
    include: {
      tradingPlan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getTradesByStatus(status: TradeStatus): Promise<TradeWithPlan[]> {
  return await prisma.trade.findMany({
    where: { status },
    include: {
      tradingPlan: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

// Statistics Services
// Close Trade with Exit Details
export async function closeTradeWithExit(
  tradeId: string, 
  exitPrice: number, 
  exitTime?: Date
): Promise<TradeWithPlan> {
  // First get the trade to calculate P&L
  const trade = await prisma.trade.findUnique({
    where: { id: tradeId },
    include: { tradingPlan: true }
  })

  if (!trade) {
    throw new Error('Trade not found')
  }

  if (trade.status !== 'OPEN') {
    throw new Error('Only open trades can be closed')
  }

  // Calculate P&L
  const priceDifference = trade.type === 'BUY' 
    ? exitPrice - trade.entryPrice 
    : trade.entryPrice - exitPrice

  const pnl = priceDifference * trade.quantity
  const pnlPercentage = (priceDifference / trade.entryPrice) * 100

  // Update the trade
  return await prisma.trade.update({
    where: { id: tradeId },
    data: {
      status: 'CLOSED',
      exitPrice,
      exitTime: exitTime || new Date(),
      pnl,
      pnlPercentage,
      updatedAt: new Date(),
    },
    include: {
      tradingPlan: true,
    },
  })
}

export async function getTradeStats(tradingPlanId?: string): Promise<TradeStats> {
  const whereClause = tradingPlanId ? { tradingPlanId } : {}
  
  // Get trading plan to access initial capital
  let tradingPlan = null
  if (tradingPlanId) {
    tradingPlan = await prisma.tradingPlan.findUnique({
      where: { id: tradingPlanId }
    })
  }
  
  const trades = await prisma.trade.findMany({
    where: {
      ...whereClause,
      status: 'CLOSED',
      pnl: { not: null },
    },
    include: {
      tradingPlan: true
    }
  })

  const totalTrades = trades.length
  const winningTrades = trades.filter(trade => (trade.pnl || 0) > 0).length
  const losingTrades = trades.filter(trade => (trade.pnl || 0) < 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
  
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  
  const winningTradesData = trades.filter(trade => (trade.pnl || 0) > 0)
  const losingTradesData = trades.filter(trade => (trade.pnl || 0) < 0)
  
  const averageWin = winningTradesData.length > 0 
    ? winningTradesData.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTradesData.length 
    : 0
    
  const averageLoss = losingTradesData.length > 0 
    ? Math.abs(losingTradesData.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTradesData.length)
    : 0

  const totalWins = winningTradesData.reduce((sum, trade) => sum + (trade.pnl || 0), 0)
  const totalLosses = Math.abs(losingTradesData.reduce((sum, trade) => sum + (trade.pnl || 0), 0))
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0

  // Calculate max drawdown
  let runningPnL = 0
  let peak = 0
  let maxDrawdown = 0
  
  for (const trade of trades) {
    runningPnL += trade.pnl || 0
    if (runningPnL > peak) {
      peak = runningPnL
    }
    const drawdown = peak - runningPnL
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  // Calculate initial capital and return percentage
  const initialCapital = tradingPlan?.initialCapital || 
    (trades.length > 0 ? trades[0].tradingPlan.initialCapital : 1000)
  const currentCapital = initialCapital + totalPnL
  const totalReturn = initialCapital > 0 ? (totalPnL / initialCapital) * 100 : 0

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    totalPnL,
    averageWin,
    averageLoss,
    profitFactor,
    maxDrawdown,
    initialCapital,
    currentCapital,
    totalReturn,
  }
}