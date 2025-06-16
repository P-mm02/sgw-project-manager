// src/types/ProjectFormType.ts
import type { ProjectType } from '@/models/Project'

export type ProjectFormType = Omit<
  ProjectType,
  | '_id'
  | 'createdAt'
  | 'updatedAt'
  | 'workLog'
  | 'projectWorth'
  | 'tags'
  | 'documents'
> & {
  projectWorth: string
  tags: string
  documents: string
}
