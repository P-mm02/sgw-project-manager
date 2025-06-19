import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const { recordTime } = await req.json()

    if (!recordTime) {
      return NextResponse.json(
        { success: false, message: 'Missing recordTime' },
        { status: 400 }
      )
    }
    const projectID = await params
    const result = await Project.findByIdAndUpdate(
      projectID.id,
      {
        $pull: {
          workLog: { recordTime: new Date(recordTime) },
        },
      },
      { new: true }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, updatedProject: result })
  } catch (error) {
    console.error('❌ Failed to delete log:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
