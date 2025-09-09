// src/app/api/OperationalPlan/member/get/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'

type MemberDTO = {
  id: string
  _id: string
  name: string
  positions: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

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

    // Use lean + map to a DTO; do NOT use Mongoose doc types here.
    const raw = await Member.find(query).sort({ createdAt: 1 }).lean()

    const members: MemberDTO[] = raw.map((m: any) => ({
      id: m._id.toString(),
      _id: m._id.toString(),
      name: m.name,
      positions: Array.isArray(m.positions) ? m.positions : [],
      active: !!m.active,
      createdAt: new Date(m.createdAt).toISOString(),
      updatedAt: new Date(m.updatedAt).toISOString(),
    }))

    return NextResponse.json({ success: true, members }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
