'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon, DollarSign, Plus } from 'lucide-react'
import { CreateCapitalAdditionInput } from '@/lib/types'

interface AddCapitalFormProps {
  tradingPlanId: string
  onSuccess?: () => void
}

export function AddCapitalForm({ tradingPlanId, onSuccess }: AddCapitalFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Omit<CreateCapitalAdditionInput, 'tradingPlanId'>>({
    amount: 0,
    description: '',
    addedAt: new Date(),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/capital-additions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tradingPlanId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add capital')
      }

      // Reset form
      setFormData({
        amount: 0,
        description: '',
        addedAt: new Date(),
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error adding capital:', error)
      alert('Gagal menambah modal. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Tambah Modal
        </CardTitle>
        <CardDescription>
          Tambahkan modal baru ke trading plan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah Modal ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addedAt">Tanggal Penambahan</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="addedAt"
                type="date"
                value={formData.addedAt?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleInputChange('addedAt', new Date(e.target.value))}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              placeholder="Contoh: Modal bulanan Januari 2024"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || formData.amount <= 0}>
            {isLoading ? 'Menambahkan...' : 'Tambah Modal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}