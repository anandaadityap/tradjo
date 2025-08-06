import { NextRequest, NextResponse } from 'next/server'
import { getTradingPlanById, updateTradingPlan, deleteTradingPlan } from '@/lib/services'
import { UpdateTradingPlanInput } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tradingPlan = await getTradingPlanById(params.id)
    if (!tradingPlan) {
      return NextResponse.json(
        { error: 'Trading plan not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(tradingPlan)
  } catch (error) {
    console.error('Error fetching trading plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading plan' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Omit<UpdateTradingPlanInput, 'id'> = await request.json()
    const updatedTradingPlan = await updateTradingPlan({
      id: params.id,
      ...body
    })
    return NextResponse.json(updatedTradingPlan)
  } catch (error) {
    console.error('Error updating trading plan:', error)
    return NextResponse.json(
      { error: 'Failed to update trading plan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteTradingPlan(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting trading plan:', error)
    return NextResponse.json(
      { error: 'Failed to delete trading plan' },
      { status: 500 }
    )
  }
}