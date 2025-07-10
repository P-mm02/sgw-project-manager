import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Notification from '@/models/Notification'

export async function POST(req: NextRequest) {
  await connectToDB()
  try {
    const data = await req.json()

    // Only pass fields your model expects!
    const newNotification = await Notification.create({
      title: data.title,
      detail: data.detail,
      notifyBeforeDays: data.notifyBeforeDays ?? [],
      notifiedDays: data.notifiedDays ?? [0],
      isNotified: data.isNotified ?? false,
      notifyDate: data.notifyDate || new Date(),
      createdBy: data.createdBy || 'system',
    })

    return NextResponse.json({ success: true, notification: newNotification })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Optional for local dev
export async function GET() {
  await connectToDB()
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100)
    return NextResponse.json({ notifications })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
