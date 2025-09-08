// src/app/api/OperationalPlan/member/get/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'

export async function GET(req: Request) {
  try {
    await connectToDB()

    const url = new URL(req.url)
    const activeParam = url.searchParams.get('active')
    const search = url.searchParams.get('search')?.trim()

    const query: any = {}
    if (activeParam === 'true') query.active = true
    if (activeParam === 'false') query.active = false
    if (search) query.$text = { $search: search }

    // IMPORTANT: don't use lean() so toJSON transform runs
    const docs = await Member.find(query).sort({ createdAt: 1 })
    const members = docs.map((d) => d.toJSON())

    return NextResponse.json({ success: true, members }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
