import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Notification from '@/models/Notification'

export async function DELETE(req) {
  await connectToDB()
  try {
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const deleted = await Notification.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
