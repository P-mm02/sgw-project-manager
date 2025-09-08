import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'
import seedData from '@/app/OperationalPlan/member.json'

/**
 * GET /api/OperationalPlan/member/seed
 * Insert members from JSON seed file.
 * Safe to call multiple times: skips existing names.
 */
export async function GET() {
  try {
    await connectToDB()

    // Transform JSON: "position" -> "positions"
    const docs = seedData.map((m: any) => ({
      name: m.name,
      positions: m.position, // schema setter normalizes to string[]
      active: true,
    }))

    const results: any[] = []
    for (const entry of docs) {
      const exists = await Member.findOne({ name: entry.name })
      if (exists) {
        results.push({ name: entry.name, skipped: true })
        continue
      }
      const doc = Member.fromPlain(entry)
      await doc.save()
      results.push({ name: doc.name, inserted: true })
    }

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Seeding failed' },
      { status: 500 }
    )
  }
}
