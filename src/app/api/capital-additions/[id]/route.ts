import { NextRequest, NextResponse } from 'next/server'
import { 
  getCapitalAdditionById, 
  updateCapitalAddition, 
  deleteCapitalAddition 
} from '@/lib/services'
import { UpdateCapitalAdditionInput } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const capitalAddition = await getCapitalAdditionById(params.id)

    if (!capitalAddition) {
      return NextResponse.json(
        { error: 'Capital addition not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(capitalAddition)
  } catch (error) {
    console.error('Error fetching capital addition:', error)
    return NextResponse.json(
      { error: 'Failed to fetch capital addition' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: Omit<UpdateCapitalAdditionInput, 'id'> = await request.json()

    const capitalAddition = await updateCapitalAddition({
      id: params.id,
      ...body,
      addedAt: body.addedAt ? new Date(body.addedAt) : undefined,
    })

    return NextResponse.json(capitalAddition)
  } catch (error) {
    console.error('Error updating capital addition:', error)
    return NextResponse.json(
      { error: 'Failed to update capital addition' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCapitalAddition(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting capital addition:', error)
    return NextResponse.json(
      { error: 'Failed to delete capital addition' },
      { status: 500 }
    )
  }
}