import { Trade, TradingPlan, TradeType, TradeStatus, CapitalAddition } from '../generated/prisma'

// Extended types with relations
export type TradeWithPlan = Trade & {
  tradingPlan: TradingPlan
}

export type TradingPlanWithTrades = TradingPlan & {
  trades: Trade[]
  capitalAdditions?: CapitalAddition[]
}

export type CapitalAdditionWithPlan = CapitalAddition & {
  tradingPlan: TradingPlan
}

// Form types for creating/updating
export type CreateTradeInput = {
  symbol: string
  type: TradeType
  entryPrice: number
  entryTime: Date
  quantity: number
  stopLoss: number
  takeProfit: number
  riskAmount: number
  rewardAmount: number
  notes?: string
  screenshot?: string
  tags?: string[]
  tradingPlanId: string
}

export type UpdateTradeInput = Partial<CreateTradeInput> & {
  id: string
  exitPrice?: number
  exitTime?: Date
  status?: TradeStatus
  pnl?: number
  pnlPercentage?: number
}

export type CreateTradingPlanInput = {
  name: string
  description?: string
  riskRewardRatio?: number
  maxLossAmount?: number
  initialCapital?: number
}

export type UpdateTradingPlanInput = Partial<CreateTradingPlanInput> & {
  id: string
  isActive?: boolean
}

// Capital Addition form types
export type CreateCapitalAdditionInput = {
  amount: number
  description?: string
  addedAt?: Date
  tradingPlanId: string
}

export type UpdateCapitalAdditionInput = Partial<CreateCapitalAdditionInput> & {
  id: string
}

// Utility types
export type TradeStats = {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  maxDrawdown: number
  initialCapital: number
  currentCapital: number
  totalReturn: number // Percentage return from initial capital
}

export { TradeType, TradeStatus }