import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Member from '@/models/OperationalPlan/Member'

/**
 * DELETE /api/OperationalPlan/member/delete/:id
 */
export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = ctx?.params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    await connectToDB()

    const deleted = await Member.findByIdAndDelete(id)
    if (!deleted)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })

    return NextResponse.json(
      { success: true, member: deleted.toJSON() },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Delete failed' },
      { status: 400 }
    )
  }
}
