// src/app/api/tempApi/route.ts
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongoose'

export async function GET() {
  try {
    const client = await clientPromise

    // 👇 Add this line to get your database
    const db = client.db('sgw') // Replace with your DB name if different

    // 👇 Now the collection call will work
    await db.collection('projects').updateMany({}, { $unset: { id: '' } })

    return NextResponse.json({
      message: 'Successfully removed "id" field from all documents.',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to remove "id"' },
      { status: 500 }
    )
  }
}
