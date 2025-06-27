import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

// PUT: update project by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const getParams = await params
  const { id } = getParams

  await connectToDB()

  try {
    const body = await req.json()

    const updated = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('❌ PUT error:', err)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
