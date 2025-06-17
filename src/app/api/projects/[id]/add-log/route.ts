import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  const body = await req.json()
  const { recorder, recordText, recordTime } = body

  try {
    await connectToDB()

    const result = await Project.findByIdAndUpdate(
      id,
      {
        $push: {
          workLog: {
            recorder,
            recordText,
            recordTime: new Date(recordTime),
          },
        },
      },
      { new: true }
    )

    return NextResponse.json({ success: true, data: result.workLog })
  } catch (error) {
    console.error('❌ Failed to update workLog:', error)
    return NextResponse.json({ success: false, error }, { status: 500 })
  }
}
