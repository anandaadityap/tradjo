'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { CapitalAdditionWithPlan } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface CapitalHistoryProps {
  tradingPlanId: string
  onUpdate?: () => void
}

export function CapitalHistory({ tradingPlanId, onUpdate }: CapitalHistoryProps) {
  const [capitalAdditions, setCapitalAdditions] = useState<CapitalAdditionWithPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCapitalAdditions = async () => {
    try {
      const response = await fetch(`/api/capital-additions?tradingPlanId=${tradingPlanId}`)
      if (response.ok) {
        const data = await response.json()
        setCapitalAdditions(data)
      }
    } catch (error) {
      console.error('Error fetching capital additions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCapitalAdditions()
  }, [tradingPlanId])

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus penambahan modal ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/capital-additions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCapitalAdditions(prev => prev.filter(addition => addition.id !== id))
        onUpdate?.()
      } else {
        alert('Gagal menghapus penambahan modal')
      }
    } catch (error) {
      console.error('Error deleting capital addition:', error)
      alert('Gagal menghapus penambahan modal')
    }
  }

  const totalCapitalAdded = capitalAdditions.reduce((sum, addition) => sum + addition.amount, 0)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Penambahan Modal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Memuat...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Riwayat Penambahan Modal
        </CardTitle>
        <CardDescription>
          Total modal yang ditambahkan: {formatCurrency(totalCapitalAdded)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {capitalAdditions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Belum ada penambahan modal
          </p>
        ) : (
          <div className="space-y-3">
            {capitalAdditions.map((addition) => (
              <div
                key={addition.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600">
                      +{formatCurrency(addition.amount)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(addition.addedAt)}
                    </Badge>
                  </div>
                  {addition.description && (
                    <p className="text-sm text-muted-foreground">
                      {addition.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(addition.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}