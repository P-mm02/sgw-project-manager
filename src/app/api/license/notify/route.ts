// ✅ API Route for triggering license notifications manually or via cron

import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { handleLicenseNotifications } from '@/lib/sendMessage/handleLicenseNotifications'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectToDB()
    const licenses = await License.find({})
    //await handleLicenseNotifications(licenses)
    console.log('📥 API received request:', new Date())
    console.log('licenses:' + licenses)


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
