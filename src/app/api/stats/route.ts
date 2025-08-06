import { NextRequest, NextResponse } from 'next/server'
import { getTradeStats } from '@/lib/services'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tradingPlanId = searchParams.get('tradingPlanId')
    
    const stats = await getTradeStats(tradingPlanId || undefined)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}