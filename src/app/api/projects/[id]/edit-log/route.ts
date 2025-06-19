import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const body = await req.json()
    const { recordTime, recorder, recordText } = body
    const projectID = await params
    const project = await Project.findById(projectID.id)
    if (!project)
      return NextResponse.json({ success: false, message: 'Not found' })
    
    type WorkLogEntry = {
      recorder: string
      recordText: string
      recordTime: Date
    }
    const log = project.workLog.find(
      (entry: WorkLogEntry) =>
        new Date(entry.recordTime).getTime() === new Date(recordTime).getTime()
    )
    

    if (!log)
      return NextResponse.json({ success: false, message: 'Log not found' })

    log.recorder = recorder
    log.recordText = recordText

    await project.save()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
