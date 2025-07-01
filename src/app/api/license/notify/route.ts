// ✅ API Route for triggering license notifications manually or via cron

import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { handleLicenseNotifications } from '@/lib/sendMessage/handleLicenseNotifications'

export async function GET() {
  try {
    await connectToDB()

    const licenses = await License.find({})
    await handleLicenseNotifications(licenses)

    return NextResponse.json({
      message: '✅ Notification job ran successfully',
    })
  } catch (err) {
    console.error('❌ Notification error:', err)
    return NextResponse.json(
      { error: '❌ Notification failed' },
      { status: 500 }
    )
  }
}
