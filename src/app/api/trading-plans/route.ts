import { NextRequest, NextResponse } from 'next/server'
import { getTradingPlans, createTradingPlan } from '@/lib/services'
import { CreateTradingPlanInput } from '@/lib/types'

export async function GET() {
  try {
    const tradingPlans = await getTradingPlans()
    return NextResponse.json(tradingPlans)
  } catch (error) {
    console.error('Error fetching trading plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trading plans' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateTradingPlanInput = await request.json()
    const newTradingPlan = await createTradingPlan(body)
    return NextResponse.json(newTradingPlan, { status: 201 })
  } catch (error) {
    console.error('Error creating trading plan:', error)
    return NextResponse.json(
      { error: 'Failed to create trading plan' },
      { status: 500 }
    )
  }
}