import { NextRequest, NextResponse } from 'next/server'
import { 
  createCapitalAddition, 
  getCapitalAdditions, 
  getCapitalAdditionsByPlan 
} from '@/lib/services'
import { CreateCapitalAdditionInput } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tradingPlanId = searchParams.get('tradingPlanId')

    let capitalAdditions
    if (tradingPlanId) {
      capitalAdditions = await getCapitalAdditionsByPlan(tradingPlanId)
    } else {
      capitalAdditions = await getCapitalAdditions()
    }

    return NextResponse.json(capitalAdditions)
  } catch (error) {
    console.error('Error fetching capital additions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch capital additions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCapitalAdditionInput = await request.json()

    // Validate required fields
    if (!body.amount || !body.tradingPlanId) {
      return NextResponse.json(
        { error: 'Amount and trading plan ID are required' },
        { status: 400 }
      )
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const capitalAddition = await createCapitalAddition({
      amount: body.amount,
      description: body.description,
      addedAt: body.addedAt ? new Date(body.addedAt) : new Date(),
      tradingPlanId: body.tradingPlanId,
    })

    return NextResponse.json(capitalAddition, { status: 201 })
  } catch (error) {
    console.error('Error creating capital addition:', error)
    return NextResponse.json(
      { error: 'Failed to create capital addition' },
      { status: 500 }
    )
  }
}