import { NextResponse } from 'next/server'
import {connectToDB} from '@/lib/mongoose'
import Project from '@/models/Project'

// GET /api/projects/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const getParams = await params
    const project = await Project.findById(getParams.id)

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('API GET /api/projects/[id] error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
