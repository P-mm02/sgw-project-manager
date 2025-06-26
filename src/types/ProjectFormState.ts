import type { ProjectType } from './ProjectType'
import type { FormFriendly } from './utils'

// Use all fields from ProjectType, but convert array/date fields to strings for forms
// Then omit fields that shouldn't appear in the form
export type ProjectFormState = Omit<
  FormFriendly<ProjectType>,
  '_id' | 'createdAt' | 'updatedAt' | '__v' | 'workLog'
>
