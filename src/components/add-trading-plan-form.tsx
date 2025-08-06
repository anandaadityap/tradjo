"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { CreateTradingPlanInput } from "@/lib/types"

interface AddTradingPlanFormProps {
  onAddPlan: (plan: CreateTradingPlanInput) => void
}

interface FormData {
  name: string
  description: string
  riskRewardRatio: string
  maxLossAmount: string
  initialCapital: string
}

export function AddTradingPlanForm({ onAddPlan }: AddTradingPlanFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    riskRewardRatio: "2.0",
    maxLossAmount: "2.0",
    initialCapital: "1000.0"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.riskRewardRatio || !formData.maxLossAmount || !formData.initialCapital) {
      return
    }

    const plan: CreateTradingPlanInput = {
      name: formData.name,
      description: formData.description || undefined,
      riskRewardRatio: Number(formData.riskRewardRatio),
      maxLossAmount: Number(formData.maxLossAmount),
      initialCapital: Number(formData.initialCapital)
    }

    onAddPlan(plan)
    setOpen(false)
    setFormData({
      name: "",
      description: "",
      riskRewardRatio: "2.0",
      maxLossAmount: "2.0",
      initialCapital: "1000.0"
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Trading Plan</DialogTitle>
          <DialogDescription>
            Set up a new trading strategy with your risk management rules and initial capital.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Conservative Strategy"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your trading strategy..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialCapital">Dana Awal ($) *</Label>
              <Input
                id="initialCapital"
                type="number"
                step="0.01"
                min="0"
                placeholder="1000.00"
                value={formData.initialCapital}
                onChange={(e) => setFormData(prev => ({ ...prev, initialCapital: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskRewardRatio">Risk:Reward *</Label>
              <Input
                id="riskRewardRatio"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="2.0"
                value={formData.riskRewardRatio}
                onChange={(e) => setFormData(prev => ({ ...prev, riskRewardRatio: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLossAmount">Max Loss ($) *</Label>
              <Input
                id="maxLossAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="2.00"
                value={formData.maxLossAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, maxLossAmount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Plan Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Dana awal: ${formData.initialCapital || "0"}</p>
              <p>• Risk reward ratio: 1:{formData.riskRewardRatio || "0"}</p>
              <p>• Maximum loss per trade: ${formData.maxLossAmount || "0"}</p>
              <p>• Risk per trade: {formData.initialCapital && formData.maxLossAmount ? 
                ((Number(formData.maxLossAmount) / Number(formData.initialCapital)) * 100).toFixed(2) : "0"}% of capital</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}