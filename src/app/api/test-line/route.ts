// src/app/api/test-line/route.ts
import { sendLineMessage } from '@/lib/sendLineMessage'
import { NextResponse } from 'next/server'

export async function GET() {
  const userId = 'YOUR_LINE_USER_ID'
  const message = '🔔 Hello from SGW project manager!'
  await sendLineMessage(userId, message)
  return NextResponse.json({ success: true })
}
