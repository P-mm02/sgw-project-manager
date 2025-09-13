import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'

// Next.js 15: params is a Promise — must be awaited
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDB()

    const { id } = await context.params
    const projectId = (id || '').trim()

    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid projectId' },
        { status: 400 }
      )
    }

    const deleted = await Project.findByIdAndDelete(projectId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      deletedId: projectId,
    })
  } catch (err: any) {
    console.error('❌ Error deleting project:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to delete project' },
      { status: 500 }
    )
  }
}
