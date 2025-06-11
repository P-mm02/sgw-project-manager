import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'

export async function GET() {
  try {
    await connectToDB()
    return NextResponse.json({ success: true, message: 'Connected to MongoDB' })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to connect', error },
      { status: 500 }
    )
  }
}
