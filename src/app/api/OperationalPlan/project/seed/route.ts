// src/app/api/OperationalPlan/project/seed/route.ts
import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/OperationalPlan/Project'
import seedData from '@/app/OperationalPlan/project.json'

export async function GET() {
  try {
    await connectToDB()

    const results: any[] = []

    for (const entry of seedData as any[]) {
      const payload = {
        projectName: entry.projectName,
        schedule: (entry.schedule ?? []).map((s: any) => ({
          startDate: s.startDate,
          endDate: s.endDate,
          memberIds: s.memberIds ?? [],
          note: s.note ?? '',
        })),
      }

      const res = await Project.findOneAndUpdate(
        { projectName: payload.projectName },
        { $set: payload },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
          includeResultMetadata: true, // <— key
        }
      )

      // res.value is the document; res.lastErrorObject tells if upsert happened
      const doc = res?.value
      const leo = (res as any)?.lastErrorObject
      const wasInserted = !!leo?.upserted || leo?.updatedExisting === false

      results.push({
        projectName: doc?.projectName,
        action: wasInserted ? 'inserted' : 'updated',
        _id: doc?._id?.toString(),
        scheduleCount: doc?.schedule?.length ?? 0,
      })
    }

    return NextResponse.json({ success: true, results })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Seeding failed' },
      { status: 500 }
    )
  }
}
