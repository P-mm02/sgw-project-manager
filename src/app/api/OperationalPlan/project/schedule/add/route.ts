import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'

type Body = {
  projectId?: string
  entry?: {
    startDate?: string
    endDate?: string
    memberIds?: string[]
    note?: string
  }
}

const isYMD = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)
const isDateOrderOK = (start: string, end: string) =>
  new Date(start) <= new Date(end)

export async function POST(req: Request) {
  try {
    await connectToDB()

    const body = (await req.json()) as Body
    const projectId = (body.projectId || '').trim()
    const entry = body.entry

    // --- Validate ---
    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid projectId' },
        { status: 400 }
      )
    }
    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'entry is required' },
        { status: 400 }
      )
    }

    const { startDate, endDate, memberIds, note } = entry

    if (!startDate || !isYMD(startDate)) {
      return NextResponse.json(
        { success: false, error: 'Invalid startDate (YYYY-MM-DD required)' },
        { status: 400 }
      )
    }
    if (!endDate || !isYMD(endDate)) {
      return NextResponse.json(
        { success: false, error: 'Invalid endDate (YYYY-MM-DD required)' },
        { status: 400 }
      )
    }
    if (!isDateOrderOK(startDate, endDate)) {
      return NextResponse.json(
        { success: false, error: 'startDate must be <= endDate' },
        { status: 400 }
      )
    }
    if (!Array.isArray(memberIds)) {
      return NextResponse.json(
        { success: false, error: 'memberIds must be an array' },
        { status: 400 }
      )
    }

    // --- Update ---
    const project = await Project.findById(projectId)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create new schedule entry with Mongo _id for uniqueness
    const newEntry = {
      _id: new Types.ObjectId(),
      startDate,
      endDate,
      memberIds,
      note: note || '',
    }

    project.schedule.push(newEntry)
    await project.save()

    // Apply toJSON mapping (_id -> id)
    const updatedProject = project.toJSON()

    return NextResponse.json({
      success: true,
      project: updatedProject,
      scheduleId: newEntry._id.toString(),
    })
  } catch (err: any) {
    console.error('❌ Error adding schedule:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to add schedule' },
      { status: 500 }
    )
  }
}
