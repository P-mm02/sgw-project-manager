// src/app/api/seed-projects/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import projectData from '@/data/projectData.json'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('sgw') // replace with your DB name
    const collection = db.collection('projects')

    // Optional: Clear old data
    await collection.deleteMany({})

    // Insert new data
    await collection.insertMany(projectData)

    return NextResponse.json({ message: 'Projects seeded successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to seed projects' },
      { status: 500 }
    )
  }
}
