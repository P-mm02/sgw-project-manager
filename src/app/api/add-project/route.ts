import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    await connectToDB() // connect using mongoose
    const newProject = new Project(data)
    await newProject.save()

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('❌ Failed to insert project:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to insert project' },
      { status: 500 }
    )
  }
}
