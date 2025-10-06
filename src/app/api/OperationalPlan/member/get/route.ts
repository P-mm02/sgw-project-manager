// src/app/api/OperationalPlan/member/get/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'

export async function GET(req: Request) {
  try {
    await connectToDB()
    const url = new URL(req.url)

    const q: any = {}
    const active = url.searchParams.get('active')
    const search = url.searchParams.get('search')?.trim()
    if (active === 'true') q.active = true
    if (active === 'false') q.active = false
    if (search) q.$text = { $search: search }

    const members = await Member.aggregate([
      { $match: q },
      { $sort: { indexNumber: 1, createdAt: 1 } },
      {
        $project: {
          id: { $toString: '$_id' },
          _id: { $toString: '$_id' }, // keep if UI needs _id
          name: 1,
          positions: 1,
          active: 1,
          indexNumber: 1,

          // <-- unify camelCase + kebab-case + fallback
          backgroundColor: {
            $ifNull: [
              '$backgroundColor',
              { $ifNull: ['$background-color', '#e2e8f0'] },
            ],
          },

          createdAt: {
            $dateToString: {
              date: '$createdAt',
              format: '%Y-%m-%dT%H:%M:%S.%LZ',
              timezone: 'UTC',
            },
          },
          updatedAt: {
            $dateToString: {
              date: { $ifNull: ['$updatedAt', '$createdAt'] },
              format: '%Y-%m-%dT%H:%M:%S.%LZ',
              timezone: 'UTC',
            },
          },
        },
      },
    ])

    return NextResponse.json({ success: true, members }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}
