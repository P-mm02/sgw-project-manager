import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Notification from '@/models/Notification'

export async function DELETE(req: Request) {
  try {
    const { ids } = (await req.json()) as { ids?: string[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 })
    }

    await connectToDB()

    const result = await Notification.deleteMany({
      _id: { $in: ids },
    })

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount ?? 0,
    })
  } catch (err) {
    console.error('[all-expired] DELETE error:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
