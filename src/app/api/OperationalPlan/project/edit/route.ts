// src/app/api/OperationalPlan/project/edit/route.ts
import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'

type Body = {
  id?: string
  projectName?: string
}

export async function PUT(req: Request) {
  try {
    await connectToDB()

    const body = (await req.json()) as Body
    const id = (body.id || '').trim()
    const projectName = (body.projectName || '').trim()

    // --- Validate ---
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project id' },
        { status: 400 }
      )
    }
    if (!projectName) {
      return NextResponse.json(
        { success: false, error: 'projectName is required' },
        { status: 400 }
      )
    }
    if (projectName.length > 120) {
      return NextResponse.json(
        { success: false, error: 'projectName is too long (max 120 chars)' },
        { status: 400 }
      )
    }

    // --- Update ---
    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: { projectName } },
      { new: true, runValidators: true }
    )

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Use toJSON to apply _id -> id and schedule _id -> id mapping
    const project = updated.toJSON()

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (err: any) {
    console.error('❌ Error editing project:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to edit project' },
      { status: 500 }
    )
  }
}

// (Optional) Support PATCH the same as PUT
export async function PATCH(req: Request) {
  return PUT(req)
}
