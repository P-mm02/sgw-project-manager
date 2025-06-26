import { connectToDB } from '@/lib/mongoose'
import License from '@/models/License'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await connectToDB()
    const body = await req.json()

    const newLicense = new License({
      ...body,
      notificationSent: false,
    })

    await newLicense.save()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving license:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
