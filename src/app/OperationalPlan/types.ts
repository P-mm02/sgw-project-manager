export type Member = { _id: string; name: string }

export type ScheduleEntry = {
  id: string // ✅ add this (toJSON maps _id -> id)
  startDate: string
  endDate: string
  memberIds: string[]
  note?: string
}

export type Project = {
  id: string // ✅ align with toJSON() output
  projectName: string
  schedule: ScheduleEntry[]
}
