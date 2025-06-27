import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const getParams = await params
    const license = await License.findById(getParams.id)
    if (!license) {
      return NextResponse.json(
        { message: 'License not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(license)
  } catch (err) {
    console.error('GET /license/[id] error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
