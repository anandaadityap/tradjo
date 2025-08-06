'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Wallet, TrendingUp } from 'lucide-react'
import { AddCapitalForm } from './add-capital-form'
import { CapitalHistory } from './capital-history'
import { formatCurrency } from '@/lib/utils'

interface CapitalManagementProps {
  tradingPlanId: string
  initialCapital: number
  totalCapitalAdded?: number
  currentCapital?: number
}

export function CapitalManagement({ 
  tradingPlanId, 
  initialCapital, 
  totalCapitalAdded = 0,
  currentCapital 
}: CapitalManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setRefreshKey(prev => prev + 1) // Trigger refresh
  }

  const totalInvested = initialCapital + totalCapitalAdded

  return (
    <div className="space-y-6">
      {/* Capital Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modal Awal</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(initialCapital)}
            </div>
            <p className="text-xs text-muted-foreground">
              Modal trading awal
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modal Ditambahkan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCapitalAdded)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total penambahan modal
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investasi</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalInvested)}
            </div>
            <p className="text-xs text-muted-foreground">
              Modal awal + penambahan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Capital Button and History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Kelola Modal</CardTitle>
              <CardDescription>
                Tambahkan modal baru ke trading plan Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Modal
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Tambah Modal Baru</DialogTitle>
                  </DialogHeader>
                  <AddCapitalForm 
                    tradingPlanId={tradingPlanId} 
                    onSuccess={handleSuccess}
                  />
                </DialogContent>
              </Dialog>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Tips Penambahan Modal:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tambahkan modal secara berkala (bulanan)</li>
                  <li>• Catat tanggal dan deskripsi yang jelas</li>
                  <li>• Monitor performa dengan modal baru</li>
                  <li>• Sesuaikan risk management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <CapitalHistory 
            key={refreshKey}
            tradingPlanId={tradingPlanId} 
            onUpdate={() => setRefreshKey(prev => prev + 1)}
          />
        </div>
      </div>
    </div>
  )
}