import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/mongoose'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectToDB()

    //remove Key
    //await Project.updateMany({}, { $unset: { latlng: '' } }, { strict: false })

    //update all
    /* await Project.updateMany(
      {},
      {
        $set: {
          mapLink: 'https://maps.app.goo.gl/VsdSQ2gsQeDeX5TQ9',
        },
      }
    ) */
    

    return NextResponse.json({ message: '✅✅✅✅✅✅✅✅successfully✅✅✅✅✅✅✅✅' })
  } catch (error) {
    console.error('❌ Failed :', error)
    return NextResponse.json(
      { error: '❌❌❌❌❌Failed❌❌❌❌❌' },
      { status: 500 }
    )
  }
}
