import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } } // Direct destructuring
) {
  const { id } = await params

  await connectToDB()
  await Project.findByIdAndDelete(id)

  return NextResponse.json({ success: true })
}
