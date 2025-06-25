// src/app/api/test-line/route.ts
import { sendLineMessage } from '@/lib/sendLineMessage'
import { NextResponse } from 'next/server'

export async function GET() {
  const userId = 'Ua053de08814ccd75375a472e6a404f3e'
  const message = '🔔 Hello from SGW project manager!'
  await sendLineMessage(userId, message)
  return NextResponse.json({ success: true })
}
