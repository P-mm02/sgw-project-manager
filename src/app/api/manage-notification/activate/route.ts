// ✅ API Route for manually or automatically triggering notification activation

import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Notification from '@/models/Notification'
import { handleActivateNotifications } from '@/lib/sendMessage/handleActivateNotifications'

export async function GET(req: Request) {  
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectToDB()
    // Fetch all notifications, or filter as needed (e.g. only pending ones)
    const notifications = await Notification.find({ isNotified: false })
    // Activate or trigger notifications
    await handleActivateNotifications(notifications)
    return NextResponse.json({
      message: '✅ Notification activation job ran successfully',
    })
  } catch (err) {
    console.error('❌ Notification activation error:', err)
    return NextResponse.json(
      { error: '❌ Notification activation failed' },
      { status: 500 }
    )
  }
}
