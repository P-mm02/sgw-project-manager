// src/app/api/OperationalPlan/member/add/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'

/** Minimal shape validation; let the schema handle casting/normalization */
function validateBasic(input: any) {
  const errors: string[] = []

  const name = typeof input?.name === 'string' ? input.name.trim() : ''
  if (!name) errors.push('Field "name" is required.')
  if (name.length > 50) errors.push('Field "name" must be ≤ 50 characters.')

  const positions = input?.positions
  const positionsOk =
    positions === undefined ||
    typeof positions === 'string' ||
    (Array.isArray(positions) && positions.every((p) => typeof p === 'string'))
  if (!positionsOk)
    errors.push('Field "positions" must be a string or string[].')

  const active = input?.active
  const activeOk = active === undefined || typeof active === 'boolean'
  if (!activeOk) errors.push('Field "active" must be a boolean.')

  if (errors.length) throw new Error(errors.join(' '))

  // Keep everything else as-is; schema will cast/normalize:
  // - indexNumber: Number & min:0 (Mongoose will cast "3" -> 3)
  // - backgroundColor: normalized by schema setter + validated
  return {
    ...input,
    name, // trimmed
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const body = await req.json()
    const cleaned = validateBasic(body)

    await connectToDB()

    // prevent duplicates by name (case-insensitive)
    const existing = await Member.findOne({
      name: { $regex: new RegExp(`^${cleaned.name}$`, 'i') },
    })
    if (existing) {
      return NextResponse.json(
        { error: `Member "${cleaned.name}" already exists.` },
        { status: 409 }
      )
    }

    // Use schema static so setters/validators run:
    // NOTE: your Member.fromPlain already accepts both kebab and camel case.
    const doc = Member.fromPlain(cleaned)
    await doc.save()

    return NextResponse.json(
      { success: true, member: doc.toJSON() },
      { status: 201 }
    )
  } catch (err: any) {
    const message =
      typeof err?.message === 'string' ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
