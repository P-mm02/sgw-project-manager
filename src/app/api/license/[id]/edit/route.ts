import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const data = await req.json()
    const getParams = await params

    const updatedLicense = await License.findByIdAndUpdate(getParams.id, data, {
      new: true,
      runValidators: true,
    })

    if (!updatedLicense) {
      return NextResponse.json(
        { message: 'License not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedLicense)
  } catch (error) {
    console.error('PUT /api/license/[id]/edit error:', error)
    return NextResponse.json({ message: 'Update failed' }, { status: 500 })
  }
}
