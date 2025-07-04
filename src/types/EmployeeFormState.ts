// src/types/EmployeeFormState.ts
import type { EmployeeType } from './EmployeeType'
import type { FormFriendly, DeepRequired } from './utils'

export type EmployeeFormState = DeepRequired<
  Omit<
    FormFriendly<EmployeeType>,
    '_id' | 'createdAt' | 'updatedAt' | '__v' | 'kpiScores' | 'kpiGiven' | 'kpiCommentCount' | 'isEmployed'
  >
>
