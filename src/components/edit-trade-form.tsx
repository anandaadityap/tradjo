"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calculator } from "lucide-react"
import { TradeWithPlan, TradingPlanWithTrades, UpdateTradeInput, TradeType } from "@/lib/types"
import { fetchTradingPlans } from "@/lib/api-client"

interface EditTradeFormProps {
  trade: TradeWithPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditTrade: (tradeId: string, trade: Omit<UpdateTradeInput, 'id'>) => void
}

export function EditTradeForm({
  trade,
  open,
  onOpenChange,
  onEditTrade
}: EditTradeFormProps) {
  const [tradingPlans, setTradingPlans] = useState<TradingPlanWithTrades[]>([])
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'BUY' as TradeType,
    entryPrice: '',
    quantity: '',
    stopLoss: '',
    takeProfit: '',
    exitPrice: '',
    exitTime: '',
    riskAmount: 0,
    rewardAmount: 0,
    notes: '',
    tags: '',
    tradingPlanId: '',
  })

  // Load trading plans
  useEffect(() => {
    const loadTradingPlans = async () => {
      try {
        const plans = await fetchTradingPlans()
        setTradingPlans(plans)
      } catch (error) {
        console.error('Error loading trading plans:', error)
      }
    }

    if (open) {
      loadTradingPlans()
    }
  }, [open])

  // Initialize form data when trade changes
  useEffect(() => {
    if (trade) {
      // Format exit time for datetime-local input
      let formattedExitTime = ''
      if (trade.exitTime) {
        const exitDate = new Date(trade.exitTime)
        const localDateTime = new Date(exitDate.getTime() - exitDate.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
        formattedExitTime = localDateTime
      }

      setFormData({
        symbol: trade.symbol,
        type: trade.type,
        entryPrice: trade.entryPrice.toString(),
        quantity: trade.quantity.toString(),
        stopLoss: trade.stopLoss.toString(),
        takeProfit: trade.takeProfit.toString(),
        exitPrice: trade.exitPrice?.toString() || '',
        exitTime: formattedExitTime,
        riskAmount: trade.riskAmount,
        rewardAmount: trade.rewardAmount,
        notes: trade.notes || '',
        tags: trade.tags ? trade.tags.join(', ') : '',
        tradingPlanId: trade.tradingPlanId,
      })
    }
  }, [trade])

  const calculateRiskReward = () => {
    if (!trade || !formData.entryPrice || !formData.quantity || !formData.stopLoss || !formData.takeProfit) {
      return
    }

    const entryPrice = Number(formData.entryPrice)
    const quantity = Number(formData.quantity)
    const stopLoss = Number(formData.stopLoss)
    const takeProfit = Number(formData.takeProfit)

    let riskAmount: number
    let rewardAmount: number

    if (formData.type === 'BUY') {
      riskAmount = (entryPrice - stopLoss) * quantity
      rewardAmount = (takeProfit - entryPrice) * quantity
    } else {
      riskAmount = (stopLoss - entryPrice) * quantity
      rewardAmount = (entryPrice - takeProfit) * quantity
    }

    setFormData(prev => ({
      ...prev,
      riskAmount: Math.abs(riskAmount),
      rewardAmount: Math.abs(rewardAmount)
    }))
  }

  // Auto-calculate risk/reward when relevant fields change
  useEffect(() => {
    calculateRiskReward()
  }, [formData.entryPrice, formData.quantity, formData.stopLoss, formData.takeProfit, formData.type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trade || !formData.symbol || !formData.entryPrice || !formData.quantity || 
        !formData.stopLoss || !formData.takeProfit || !formData.tradingPlanId) {
      return
    }

    const updateData: Omit<UpdateTradeInput, 'id'> = {
      symbol: formData.symbol,
      type: formData.type,
      entryPrice: Number(formData.entryPrice),
      quantity: Number(formData.quantity),
      stopLoss: Number(formData.stopLoss),
      takeProfit: Number(formData.takeProfit),
      riskAmount: Number(formData.riskAmount),
      rewardAmount: Number(formData.rewardAmount),
      notes: formData.notes,
      tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
      tradingPlanId: formData.tradingPlanId,
    }

    // Add exit data if trade is closed and exit fields are filled
    if (trade.status === 'CLOSED') {
      if (formData.exitPrice) {
        updateData.exitPrice = Number(formData.exitPrice)
      }
      if (formData.exitTime) {
        updateData.exitTime = new Date(formData.exitTime)
      }
    }

    onEditTrade(trade.id, updateData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  if (!trade) return null

  const isClosedTrade = trade.status === 'CLOSED'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
          <DialogDescription>
            Update the details of your trade. Risk and reward will be calculated automatically.
            {isClosedTrade && " You can also edit exit details for closed trades."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., EURUSD, BTCUSD"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as TradeType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradingPlan">Trading Plan</Label>
            <Select 
              value={formData.tradingPlanId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, tradingPlanId: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tradingPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} (RR: 1:{plan.riskRewardRatio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                placeholder="0.00000"
                value={formData.entryPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00001"
                placeholder="0.00000"
                value={formData.stopLoss}
                onChange={(e) => setFormData(prev => ({ ...prev, stopLoss: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <div className="flex gap-2">
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.00001"
                  placeholder="0.00000"
                  value={formData.takeProfit}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeProfit: e.target.value }))}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={calculateRiskReward}
                  title="Calculate based on risk-reward ratio"
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Exit Details Section - Only show for closed trades */}
          {isClosedTrade && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Exit Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    step="0.00001"
                    placeholder="0.00000"
                    value={formData.exitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitTime">Exit Time</Label>
                  <Input
                    id="exitTime"
                    type="datetime-local"
                    value={formData.exitTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, exitTime: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {formData.riskAmount && formData.rewardAmount && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <Label className="text-sm text-muted-foreground">Risk Amount</Label>
                <p className="font-medium text-red-600">${formData.riskAmount.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Reward Amount</Label>
                <p className="font-medium text-green-600">${formData.rewardAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="e.g., breakout, trend, support"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Trade analysis, setup description, etc."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Update Trade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}