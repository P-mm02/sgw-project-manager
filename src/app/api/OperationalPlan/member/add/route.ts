// src/app/api/OperationalPlan/member/add/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member, { type MemberAttrs } from '@/models/OperationalPlan/Member'

/** Basic inline validation (kept lightweight; Zod overkill here) */
function validatePayload(input: any): MemberAttrs {
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

  if (errors.length) {
    const message = errors.join(' ')
    throw new Error(message)
  }

  return { name, positions, active }
}

export async function POST(req: Request) {
  try {
    // Reject wrong content-type early (helps client debugging)
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      )
    }

    const body = await req.json()
    const payload = validatePayload(body)

    await connectToDB()

    // Optional: avoid accidental duplicates by name (not a unique index)
    const existing = await Member.findOne({ name: payload.name })
    if (existing) {
      return NextResponse.json(
        { error: `Member "${payload.name}" already exists.` },
        { status: 409 }
      )
    }

    // Build via schema static so your setter/normalizer runs
    const doc = Member.fromPlain(payload)
    await doc.save()

    // toJSON transform will add `id` and remove `_id`
    return NextResponse.json(
      { success: true, member: doc.toJSON() },
      { status: 201 }
    )
  } catch (err: any) {
    // Mongoose validation or custom validation errors land here
    const message =
      typeof err?.message === 'string' ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
