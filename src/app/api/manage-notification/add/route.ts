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
      notifiedDays: data.notifiedDays ?? [],
      isNotified: data.isNotified ?? false,
      notifyDate: data.notifyDate || new Date(),
      createdBy: data.createdBy || 'ไม่ระบุ',
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

