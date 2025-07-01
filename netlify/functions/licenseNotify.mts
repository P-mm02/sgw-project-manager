/// <reference types="@netlify/functions" />
import { Handler } from '@netlify/functions'
import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { handleLicenseNotifications } from '@/lib/sendMessage/handleLicenseNotifications'

const handler: Handler = async () => {
  await connectToDB()

  const licenses = await License.find({})

  await handleLicenseNotifications(licenses)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '✅ Notification job ran successfully' }),
  }
}

export const config = {
  schedule: '0 0,10 * * *', // Every day at 7:00 and 17:00 (UTC+7)
}

export default handler
