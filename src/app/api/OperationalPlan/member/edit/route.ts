import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'

/**
 * PUT /api/OperationalPlan/member/edit
 * Body: { id: string, name?: string, positions?: string|string[], active?: boolean }
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const id = typeof body?.id === 'string' ? body.id : ''
    if (!id)
      return NextResponse.json(
        { error: 'Field "id" is required.' },
        { status: 400 }
      )

    const update: any = {}
    if (typeof body?.name === 'string') {
      const name = body.name.trim()
      if (!name)
        return NextResponse.json(
          { error: 'Field "name" cannot be empty.' },
          { status: 400 }
        )
      if (name.length > 50)
        return NextResponse.json(
          { error: 'Field "name" must be ≤ 50 chars.' },
          { status: 400 }
        )
      update.name = name
    }

    if (body?.positions !== undefined) {
      const pos = body.positions
      const ok =
        typeof pos === 'string' ||
        (Array.isArray(pos) && pos.every((p: any) => typeof p === 'string'))
      if (!ok)
        return NextResponse.json(
          { error: 'Field "positions" must be a string or string[]' },
          { status: 400 }
        )
      update.positions = pos // schema setter will normalize to string[]
    }

    if (body?.active !== undefined) {
      if (typeof body.active !== 'boolean')
        return NextResponse.json(
          { error: 'Field "active" must be boolean' },
          { status: 400 }
        )
      update.active = body.active
    }

    await connectToDB()

    // Optional duplicate-name check if name is changing
    if (update.name) {
      const dupe = await Member.findOne({
        _id: { $ne: id },
        name: update.name,
      }).lean()
      if (dupe)
        return NextResponse.json(
          { error: `Member "${update.name}" already exists.` },
          { status: 409 }
        )
    }

    // Use findById first to ensure setters run cleanly when assigning & saving
    const doc = await Member.findById(id)
    if (!doc)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })

    if (update.name !== undefined) doc.name = update.name
    if (update.positions !== undefined)
      (doc as any).positions = update.positions // triggers setter
    if (update.active !== undefined) doc.active = update.active

    await doc.save()
    return NextResponse.json(
      { success: true, member: doc.toJSON() },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Update failed' },
      { status: 400 }
    )
  }
}
