// src/app/api/test-line/route.ts
import { sendLineMessage } from '@/lib/sendLineMessage'
import { NextResponse } from 'next/server'

export async function GET() {
  const userId = '1170600160847'
  const message = '🔔 Hello from SGW project manager!'
  await sendLineMessage(userId, message)
  return NextResponse.json({ success: true })
}
