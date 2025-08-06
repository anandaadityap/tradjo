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
import { TradeWithPlan } from "@/lib/types"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CloseTradeDialogProps {
  trade: TradeWithPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseTrade: (tradeId: string, exitPrice: number, exitTime?: Date) => void
}

export function CloseTradeDialog({ 
  trade, 
  open, 
  onOpenChange, 
  onCloseTrade 
}: CloseTradeDialogProps) {
  const [exitPrice, setExitPrice] = useState("")
  const [exitTime, setExitTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trade || !exitPrice) return

    setIsLoading(true)
    
    try {
      const exitDateTime = exitTime ? new Date(exitTime) : new Date()
      await onCloseTrade(trade.id, parseFloat(exitPrice), exitDateTime)
      
      // Reset form
      setExitPrice("")
      setExitTime("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error closing trade:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePotentialPnL = () => {
    if (!trade || !exitPrice) return null
    
    const exit = parseFloat(exitPrice)
    const priceDifference = trade.type === 'BUY' 
      ? exit - trade.entryPrice 
      : trade.entryPrice - exit
    
    const pnl = priceDifference * trade.quantity
    
    // Calculate percentage based on trade direction
    let pnlPercentage: number
    if (trade.type === 'BUY') {
      // For BUY: (exit - entry) / entry * 100
      pnlPercentage = ((exit - trade.entryPrice) / trade.entryPrice) * 100
    } else {
      // For SELL: (entry - exit) / entry * 100
      pnlPercentage = ((trade.entryPrice - exit) / trade.entryPrice) * 100
    }
    
    return { pnl, pnlPercentage }
  }

  const potentialResult = calculatePotentialPnL()

  // Set default exit time to current time when dialog opens
  useEffect(() => {
    if (open && !exitTime) {
      const now = new Date()
      const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
      setExitTime(localDateTime)
    }
  }, [open, exitTime])

  if (!trade) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {trade.type === "BUY" ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            Close Trade: {trade.symbol}
          </DialogTitle>
          <DialogDescription>
            Enter the exit details to close this {trade.type.toLowerCase()} position.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Trade Info */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Entry Price</Label>
                <p className="font-medium">${trade.entryPrice.toFixed(4)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Quantity</Label>
                <p className="font-medium">{trade.quantity}</p>
              </div>
            </div>

            {/* Exit Price */}
            <div className="grid gap-2">
              <Label htmlFor="exitPrice">Exit Price *</Label>
              <Input
                id="exitPrice"
                type="number"
                step="0.0001"
                placeholder="Enter exit price"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                required
              />
            </div>

            {/* Exit Time */}
            <div className="grid gap-2">
              <Label htmlFor="exitTime">Exit Time</Label>
              <Input
                id="exitTime"
                type="datetime-local"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
              />
            </div>

            {/* Potential P&L Preview */}
            {potentialResult !== null && (
              <div className="p-3 bg-muted rounded-lg">
                <Label className="text-xs text-muted-foreground">Potential P&L</Label>
                <div className={`${
                  potentialResult.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <p className="text-lg font-bold">
                    {potentialResult.pnl >= 0 ? '+' : ''}${potentialResult.pnl.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    {potentialResult.pnlPercentage >= 0 ? '+' : ''}{potentialResult.pnlPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!exitPrice || isLoading}
            >
              {isLoading ? "Closing..." : "Close Trade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}