import { NextRequest, NextResponse } from 'next/server'
import { getTrades, createTrade } from '@/lib/services'
import { CreateTradeInput } from '@/lib/types'

export async function GET() {
  try {
    const trades = await getTrades()
    return NextResponse.json(trades)
  } catch (error) {
    console.error('Error fetching trades:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trades' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTradeInput = await request.json()
    const newTrade = await createTrade(body)
    return NextResponse.json(newTrade, { status: 201 })
  } catch (error) {
    console.error('Error creating trade:', error)
    return NextResponse.json(
      { error: 'Failed to create trade' },
      { status: 500 }
    )
  }
}