import { connectToDB } from './mongoose'
import Project from '@/models/Project'

export async function getProjectById(id: string) {
  await connectToDB()

  try {
    const project = await Project.findById(id).lean()
    return project ? JSON.parse(JSON.stringify(project)) : null
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}
