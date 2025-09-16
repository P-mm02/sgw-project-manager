// src/app/api/OperationalPlan/project/get/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'

/**
 * GET /api/OperationalPlan/project/get?search=&page=&limit=
 * - Returns projects (paginated) with schedule subdocs.
 * - Uses text search on projectName when `search` is provided.
 * - IMPORTANT: We DO NOT use .lean() so ProjectSchema.toJSON runs and maps _id -> id (also for schedule subdocs).
 */
export async function GET(req: Request) {
  try {
    await connectToDB()

    const { searchParams } = new URL(req.url)
    const search = (searchParams.get('search') || '').trim()
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const limit = Math.min(
      Math.max(parseInt(searchParams.get('limit') || '50', 10), 1),
      200
    )
    const skip = (page - 1) * limit

    // Build filter
    let filter: any = {}
    let sort: any = { createdAt: 1 }

    if (search) {
      // Prefer text search (ProjectSchema has ProjectSchema.index({ projectName: 'text' }))
      filter = { $text: { $search: search } }
      sort = { score: { $meta: 'textScore' }, createdAt: -1 }
    }

    // Count for pagination
    const total = await Project.countDocuments(filter)

    // Query
    const query = Project.find(filter).sort(sort).skip(skip).limit(limit)

    // If using $text, project the score so sorting by textScore works consistently
    if (search) {
      query.select({ score: { $meta: 'textScore' } })
    }

    const docs = await query.exec()

    // Use .toJSON() to apply the schema's transform that maps _id -> id and schedule._id -> schedule.id
    const projects = docs.map((d) => d.toJSON())

    return NextResponse.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      count: projects.length,
      projects,
    })
  } catch (err: any) {
    console.error('❌ Error fetching projects:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
