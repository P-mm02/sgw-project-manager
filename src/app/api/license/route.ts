import { NextResponse } from 'next/server'
import License from '@/models/License'
import { connectToDB } from '@/lib/mongoose'

export async function GET() {
  await connectToDB()
  const licenses = await License.find().sort({ licenseExpireDate: -1 }).lean()
  return NextResponse.json(licenses)
}
