import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Notification from '@/models/Notification'

export async function GET(req: NextRequest) {
  await connectToDB()
  try {
    const notifications = await Notification.find()
      .sort({ notifyDate: 1 })
      .limit(200)
      .lean()
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
