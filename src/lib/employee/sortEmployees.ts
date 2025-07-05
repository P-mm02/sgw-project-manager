import { EmployeeType } from '@/types/EmployeeType'

export type SortableField =
  | 'nickName'
  | 'firstName'
  | 'jobTitle'
  | 'birthDate'
  | 'team'

export function sortEmployees(
  employees: EmployeeType[],
  sortBy: SortableField
): EmployeeType[] {
  return [...employees].sort((a, b) => {
    if (sortBy === 'birthDate') {
      const dateA = a.birthDate ? new Date(a.birthDate).getTime() : 0
      const dateB = b.birthDate ? new Date(b.birthDate).getTime() : 0
      return dateA - dateB
    }

    if (sortBy === 'team') {
      const nameA = a.team?.name || ''
      const nameB = b.team?.name || ''
      return nameA.localeCompare(nameB)
    }

    const A = a[sortBy]
    const B = b[sortBy]

    return (A?.toString() || '').localeCompare(B?.toString() || '')
  })
}
