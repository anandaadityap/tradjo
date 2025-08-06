import { 
  TradingPlanWithTrades, 
  TradeWithPlan, 
  CreateTradingPlanInput, 
  CreateTradeInput, 
  UpdateTradeInput,
  TradeStats 
} from './types'

// Trading Plans API
export async function fetchTradingPlans(): Promise<TradingPlanWithTrades[]> {
  const response = await fetch('/api/trading-plans')
  if (!response.ok) {
    throw new Error('Failed to fetch trading plans')
  }
  return response.json()
}

export async function createTradingPlanAPI(data: CreateTradingPlanInput): Promise<TradingPlanWithTrades> {
  const response = await fetch('/api/trading-plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create trading plan')
  }
  return response.json()
}

export async function deleteTradingPlanAPI(id: string): Promise<void> {
  const response = await fetch(`/api/trading-plans/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete trading plan')
  }
}

// Trades API
export async function fetchTrades(): Promise<TradeWithPlan[]> {
  const response = await fetch('/api/trades')
  if (!response.ok) {
    throw new Error('Failed to fetch trades')
  }
  return response.json()
}

export async function createTradeAPI(data: CreateTradeInput): Promise<TradeWithPlan> {
  const response = await fetch('/api/trades', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create trade')
  }
  return response.json()
}

export async function updateTradeAPI(data: UpdateTradeInput): Promise<TradeWithPlan> {
  const response = await fetch(`/api/trades/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update trade')
  }
  return response.json()
}

export async function deleteTradeAPI(id: string): Promise<void> {
  const response = await fetch(`/api/trades/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete trade')
  }
}

export async function closeTradeAPI(id: string, exitPrice: number, exitDate: Date): Promise<TradeWithPlan> {
  const response = await fetch(`/api/trades/${id}/close`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exitPrice, exitDate }),
  })
  if (!response.ok) {
    throw new Error('Failed to close trade')
  }
  return response.json()
}

// Stats API
export async function fetchStats(tradingPlanId?: string): Promise<TradeStats> {
  const url = tradingPlanId 
    ? `/api/stats?tradingPlanId=${tradingPlanId}`
    : '/api/stats'
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch stats')
  }
  return response.json()
}