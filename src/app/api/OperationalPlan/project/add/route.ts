import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project, { type ProjectAttrs } from '@/models/OperationalPlan/Project'

type Body = {
  projectName?: string
  schedule?: Array<{
    startDate?: string
    endDate?: string
    memberIds?: string[]
    note?: string
  }>
}

const isYMD = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)
const isDateOrderOK = (start: string, end: string) =>
  new Date(start) <= new Date(end)

export async function POST(req: Request) {
  try {
    await connectToDB()

    const body = (await req.json()) as Body
    const projectName = (body.projectName || '').trim()
    const scheduleInput = Array.isArray(body.schedule) ? body.schedule : []

    // --- Validate projectName ---
    if (!projectName) {
      return NextResponse.json(
        { success: false, error: 'projectName is required' },
        { status: 400 }
      )
    }

    // --- Validate schedule entries ---
    for (let i = 0; i < scheduleInput.length; i++) {
      const entry = scheduleInput[i] || {}
      const { startDate, endDate, memberIds, note } = entry

      if (!startDate || !isYMD(startDate)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid startDate at index ${i} (YYYY-MM-DD required)`,
          },
          { status: 400 }
        )
      }
      if (!endDate || !isYMD(endDate)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid endDate at index ${i} (YYYY-MM-DD required)`,
          },
          { status: 400 }
        )
      }
      if (!isDateOrderOK(startDate, endDate)) {
        return NextResponse.json(
          {
            success: false,
            error: `startDate must be <= endDate at index ${i}`,
          },
          { status: 400 }
        )
      }
      if (!Array.isArray(memberIds)) {
        return NextResponse.json(
          { success: false, error: `memberIds must be an array at index ${i}` },
          { status: 400 }
        )
      }
      if (note !== undefined && typeof note !== 'string') {
        return NextResponse.json(
          { success: false, error: `note must be a string at index ${i}` },
          { status: 400 }
        )
      }
    }

    // --- Normalize to ProjectAttrs (let Mongoose auto-generate subdoc _id) ---
    const attrs: ProjectAttrs = {
      projectName,
      schedule: scheduleInput.map((s) => ({
        startDate: s.startDate!, // safe after validation
        endDate: s.endDate!,
        memberIds: s.memberIds ?? [],
        note: s.note?.trim() || '',
      })),
    }

    // --- Create & save ---
    const doc = Project.fromPlain(attrs)
    const project = await doc.save()

    return NextResponse.json({
      success: true,
      project: project.toJSON(), // maps _id -> id (and schedule subdoc ids) per your schema
      projectId: project._id.toString(), // strongly typed if _id is Types.ObjectId
    })
  } catch (err: any) {
    console.error('❌ Error creating project:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create project' },
      { status: 500 }
    )
  }
}
