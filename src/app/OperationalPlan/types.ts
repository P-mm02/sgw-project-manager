export type Member = { _id: string; name: string }

export type ScheduleEntry = {
  startDate: string // YYYY-MM-DD (local BKK)
  endDate: string // YYYY-MM-DD (local BKK)
  memberIds: string[]
  note?: string
}

export type Project = {
  _id: string
  projectName: string
  schedule: ScheduleEntry[]
}
