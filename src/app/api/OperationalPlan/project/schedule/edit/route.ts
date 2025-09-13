import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'

type Body = {
  projectId?: string
  scheduleId?: string
  patch?: {
    startDate?: string
    endDate?: string
    memberIds?: string[]
    note?: string
  }
}

const isYMD = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)
const isDateOrderOK = (start: string, end: string) =>
  new Date(start) <= new Date(end)

export async function PUT(req: Request) {
  try {
    await connectToDB()

    const body = (await req.json()) as Body
    const projectId = (body.projectId || '').trim()
    const scheduleId = (body.scheduleId || '').trim()
    const patch = body.patch ?? {}

    // --- Validate basic inputs ---
    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid projectId' },
        { status: 400 }
      )
    }
    if (!scheduleId || !Types.ObjectId.isValid(scheduleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid scheduleId' },
        { status: 400 }
      )
    }
    if (!patch || Object.keys(patch).length === 0) {
      return NextResponse.json(
        { success: false, error: 'patch is required (at least one field)' },
        { status: 400 }
      )
    }

    const { startDate, endDate, memberIds, note } = patch

    if (startDate !== undefined && !isYMD(startDate)) {
      return NextResponse.json(
        { success: false, error: 'Invalid startDate (YYYY-MM-DD required)' },
        { status: 400 }
      )
    }
    if (endDate !== undefined && !isYMD(endDate)) {
      return NextResponse.json(
        { success: false, error: 'Invalid endDate (YYYY-MM-DD required)' },
        { status: 400 }
      )
    }
    if (memberIds !== undefined && !Array.isArray(memberIds)) {
      return NextResponse.json(
        { success: false, error: 'memberIds must be an array' },
        { status: 400 }
      )
    }
    if (note !== undefined && typeof note !== 'string') {
      return NextResponse.json(
        { success: false, error: 'note must be a string' },
        { status: 400 }
      )
    }

    // --- Fetch current schedule entry for date-order validation ---
    const doc = await Project.findOne(
      { _id: projectId, 'schedule._id': new Types.ObjectId(scheduleId) },
      { 'schedule.$': 1 } // return only the matched schedule entry
    )

    if (!doc || !doc.schedule || doc.schedule.length === 0) {
      // Distinguish project vs schedule not found
      const projectExists = await Project.exists({ _id: projectId })
      return NextResponse.json(
        {
          success: false,
          error: projectExists
            ? 'Schedule entry not found'
            : 'Project not found',
        },
        { status: 404 }
      )
    }

    const current = doc.schedule[0] as {
      _id: Types.ObjectId
      startDate: string
      endDate: string
      memberIds: string[]
      note?: string
    }

    const newStart = startDate ?? current.startDate
    const newEnd = endDate ?? current.endDate
    if (!isDateOrderOK(newStart, newEnd)) {
      return NextResponse.json(
        { success: false, error: 'startDate must be <= endDate' },
        { status: 400 }
      )
    }

    // --- Build $set only for provided fields ---
    const set: Record<string, any> = {}
    if (startDate !== undefined) set['schedule.$.startDate'] = startDate
    if (endDate !== undefined) set['schedule.$.endDate'] = endDate
    if (memberIds !== undefined) set['schedule.$.memberIds'] = memberIds
    if (note !== undefined) set['schedule.$.note'] = note

    // --- Apply update ---
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, 'schedule._id': new Types.ObjectId(scheduleId) },
      { $set: set },
      { new: true }
    )

    if (!updatedProject) {
      // Safety (should not happen because we already matched above)
      return NextResponse.json(
        { success: false, error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      project: updatedProject.toJSON(), // respects any toJSON mappings
      editedScheduleId: scheduleId,
    })
  } catch (err: any) {
    console.error('❌ Error editing schedule:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to edit schedule' },
      { status: 500 }
    )
  }
}
