import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('Entering webhook function POST')  
  const body = await req.json()
  console.log('Pass: const body = await req.json()')

  console.log('📩 Incoming LINE webhook event:', JSON.stringify(body, null, 2))
  console.log('Pass: 📩 Incoming LINE webhook event:')

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
    console.log('Pass: log each event with userId')
    
  }

  return NextResponse.json({ status: 'received' }, { status: 200 })
  console.log('Pass: return NextResponse.json')

}
