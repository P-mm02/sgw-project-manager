import axios from 'axios'

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN

export async function sendLineMessage(userId: string, message: string) {
  const url = 'https://api.line.me/v2/bot/message/push'

  const body = {
    to: userId,
    messages: [
      {
        type: 'text',
        text: message,
      },
    ],
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
  }

  try {
    await axios.post(url, body, { headers })
    //console.log('✅ Message sent', res.data)
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        '❌ Error sending LINE message',
        err.response?.data || err.message
      )
    } else {
      console.error('❌ Unknown error', err)
    }
  }
  
}
