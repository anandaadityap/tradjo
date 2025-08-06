import { NextRequest, NextResponse } from 'next/server'
import { closeTradeWithExit } from '@/lib/services'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { exitPrice, exitDate } = body
    
    const closedTrade = await closeTradeWithExit(id, exitPrice, exitDate)
    return NextResponse.json(closedTrade)
  } catch (error) {
    console.error('Error closing trade:', error)
    return NextResponse.json(
      { error: 'Failed to close trade' },
      { status: 500 }
    )
  }
}