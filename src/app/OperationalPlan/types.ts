export type ScheduleEntry = {
  id: string // ✅ add this (toJSON maps _id -> id)
  startDate: string
  endDate: string
  memberIds: string[]
  note?: string
}
