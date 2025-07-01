/// <reference types="@netlify/functions" />
import { Handler } from '@netlify/functions'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { handleLicenseNotifications } from '@/lib/sendMessage/handleLicenseNotifications'

/* const handler: Handler = async () => {
  console.log('🏁 handler triggered')
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Test OK' }),
  }
}
 */

const handler: Handler = async () => {
  try {
    console.log('🔗 Connecting to database...')
    await connectToDB()

    console.log('📦 Fetching licenses...')
    const licenses = await License.find({})

    console.log('📤 Sending notifications...')
    await handleLicenseNotifications(licenses)
    console.log('After: await handleLicenseNotifications(licenses)')

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '✅ Notification job ran successfully' }),
    }
  }
  catch (err) {
    console.error('❌ Error in notification job', err)

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: '❌ Error in notification job',
        error:
          err instanceof Error
            ? {
                name: err.name,
                message: err.message,
                stack: err.stack,
              }
            : String(err),
      }),
    }
  }
}


export const config = {
  schedule: '0 0,10 * * *', // Every day at 8:00 and 20:00 (UTC+7)
}

export default handler
