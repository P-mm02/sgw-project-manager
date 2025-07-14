import { NextRequest, NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Notification from '@/models/Notification'

export async function PUT(req: NextRequest) {
  await connectToDB()
  try {
    const data = await req.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 })
    }

    // Only update fields your model expects!
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      {
        title: data.title,
        detail: data.detail,
        notifyBeforeDays: data.notifyBeforeDays ?? [],
        notifyDate: data.notifyDate,
        createdBy: data.createdBy ?? 'ไม่ระบุ',
      },
      { new: true }
    )

    if (!updatedNotification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, notification: updatedNotification })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
