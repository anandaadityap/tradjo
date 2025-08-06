import { TradeType } from './types'

// Calculate risk amount based on entry price, stop loss, and quantity
export function calculateRiskAmount(
  entryPrice: number,
  stopLoss: number,
  quantity: number,
  tradeType: TradeType
): number {
  if (tradeType === 'BUY') {
    return Math.abs(entryPrice - stopLoss) * quantity
  } else {
    return Math.abs(stopLoss - entryPrice) * quantity
  }
}

// Calculate reward amount based on entry price, take profit, and quantity
export function calculateRewardAmount(
  entryPrice: number,
  takeProfit: number,
  quantity: number,
  tradeType: TradeType
): number {
  if (tradeType === 'BUY') {
    return Math.abs(takeProfit - entryPrice) * quantity
  } else {
    return Math.abs(entryPrice - takeProfit) * quantity
  }
}

// Calculate take profit price based on risk reward ratio
export function calculateTakeProfitPrice(
  entryPrice: number,
  stopLoss: number,
  riskRewardRatio: number,
  tradeType: TradeType
): number {
  const riskPerUnit = Math.abs(entryPrice - stopLoss)
  const rewardPerUnit = riskPerUnit * riskRewardRatio
  
  if (tradeType === 'BUY') {
    return entryPrice + rewardPerUnit
  } else {
    return entryPrice - rewardPerUnit
  }
}

// Calculate PnL for a trade
export function calculatePnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  tradeType: TradeType
): number {
  if (tradeType === 'BUY') {
    return (exitPrice - entryPrice) * quantity
  } else {
    return (entryPrice - exitPrice) * quantity
  }
}

// Calculate PnL percentage
export function calculatePnLPercentage(
  entryPrice: number,
  exitPrice: number,
  tradeType: TradeType
): number {
  if (tradeType === 'BUY') {
    return ((exitPrice - entryPrice) / entryPrice) * 100
  } else {
    return ((entryPrice - exitPrice) / entryPrice) * 100
  }
}

// Validate risk amount against max loss
export function validateRiskAmount(
  riskAmount: number,
  maxLossAmount: number
): boolean {
  return riskAmount <= maxLossAmount
}

// Calculate position size based on risk amount and stop loss distance
export function calculatePositionSize(
  accountBalance: number,
  riskPercentage: number,
  entryPrice: number,
  stopLoss: number
): number {
  const riskAmount = accountBalance * (riskPercentage / 100)
  const stopLossDistance = Math.abs(entryPrice - stopLoss)
  return riskAmount / stopLossDistance
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format percentage
export function formatPercentage(percentage: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percentage / 100)
}