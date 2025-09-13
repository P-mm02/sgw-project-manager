// src/app/OperationalPlan/addProject/types.ts
export type Member = {
  id: string
  name: string
  positions: string[]
  active: boolean
}

export type ScheduleEntryInput = {
  startDate: string
  endDate: string
  memberIds: string[]
  note?: string
}

export type ScheduleEntry = ScheduleEntryInput & { id: string }

export type Project = {
  id: string
  projectName: string
  schedule: ScheduleEntry[]
  createdAt?: string
  updatedAt?: string
}
