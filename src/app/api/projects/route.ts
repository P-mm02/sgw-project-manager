import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectToDB()

    const projects = await Project.find().sort({ createdAt: -1 }) // latest first
    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error('❌ Failed to fetch projects:', error)
        
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
