import { NextResponse } from 'next/server'
import License from '@/models/License'
import { connectToDB } from '@/lib/mongoose'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDB()

  try {
    const paramsID = await params
    await License.findByIdAndDelete(paramsID.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
