import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise
    const db = client.db('sgw-projects')
    const projects = await db.collection('projects').find({}).toArray()

    res.status(200).json(projects)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch projects' })
  }
}
