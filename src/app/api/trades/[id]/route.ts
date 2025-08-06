import { NextRequest, NextResponse } from 'next/server'
import { getTradeById, updateTrade, deleteTrade } from '@/lib/services'
import { UpdateTradeInput } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const trade = await getTradeById(params.id)
    if (!trade) {
      return NextResponse.json(
        { error: 'Trade not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(trade)
  } catch (error) {
    console.error('Error fetching trade:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trade' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Omit<UpdateTradeInput, 'id'> = await request.json()
    const updatedTrade = await updateTrade({
      id: params.id,
      ...body
    })
    return NextResponse.json(updatedTrade)
  } catch (error) {
    console.error('Error updating trade:', error)
    return NextResponse.json(
      { error: 'Failed to update trade' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTrade(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting trade:', error)
    return NextResponse.json(
      { error: 'Failed to delete trade' },
      { status: 500 }
    )
  }
}