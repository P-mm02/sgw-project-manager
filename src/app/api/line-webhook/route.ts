import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  console.log('📩 Incoming LINE webhook event:', JSON.stringify(body, null, 2))

  // Optional: log each event with userId
  if (body.events && Array.isArray(body.events)) {
    type LINEEvent = {
      type: string
      source: {
        userId: string
        type: string
      }
      message?: {
        type: string
        text?: string
      }
    }

    body.events.forEach((event: LINEEvent) => {
      console.log(`👤 userId: ${event.source.userId}`)
      console.log(`💬 type: ${event.type}`)
      console.log(`📝 message: ${event.message?.text || 'no text'}`)
    })
      
  }

  return NextResponse.json({ status: 'received' }, { status: 200 })
}
