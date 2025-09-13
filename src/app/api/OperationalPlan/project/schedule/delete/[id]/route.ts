// src/app/api/OperationalPlan/project/schedule/delete/[id]/route.ts
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params is a Promise in Next.js 15
) {
  try {
    await connectToDB()

    const { id } = await context.params // 👈 await it
    const scheduleId = (id || '').trim()

    const { searchParams } = new URL(req.url)
    const projectId = (searchParams.get('projectId') || '').trim()

    // --- Validate ---
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

    // Perform delete (single round-trip). If it returns null, either project or schedule not found.
    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, 'schedule._id': new Types.ObjectId(scheduleId) },
      { $pull: { schedule: { _id: new Types.ObjectId(scheduleId) } } },
      { new: true }
    )

    if (!updatedProject) {
      // Disambiguate 404
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

    return NextResponse.json({
      success: true,
      project: updatedProject.toJSON(),
      deletedScheduleId: scheduleId,
    })
  } catch (err: any) {
    console.error('❌ Error deleting schedule:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete schedule' },
      { status: 500 }
    )
  }
}
