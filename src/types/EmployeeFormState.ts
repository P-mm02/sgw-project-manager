import type { EmployeeType } from './EmployeeType'
import type { FormFriendly } from './utils'

export type EmployeeFormState = Omit<
  FormFriendly<EmployeeType>,
  '_id' | 'createdAt' | 'updatedAt' | '__v' | 'kpiScores' | 'kpiGiven' | 'kpiCommentCount' | 'isEmployed'
>
