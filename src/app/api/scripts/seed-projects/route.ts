import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'
import projectData from '@/data/projectData.json'

export async function GET() {
  try {
    await connectToDB()

    // Optional: Clear existing projects
    await Project.deleteMany({})
    console.log('✅ Cleared existing projects')

    // Insert new seed data
    await Project.insertMany(projectData)
    console.log('✅ Inserted new seed data')

    return NextResponse.json({ message: 'Projects seeded successfully' })
  } catch (error) {
    console.error('❌ Failed to seed projects:', error)
    return NextResponse.json(
      { error: 'Failed to seed projects' },
      { status: 500 }
    )
  }
}
