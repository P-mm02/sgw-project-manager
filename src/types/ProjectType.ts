export type WorkLogEntry = {
  recorder?: string
  recordTime?: string
  recordText?: string
}

export type ProjectType = {
  _id: string
  projectName: string
  location: string
  mapLink: string
  client: string
  supervisor: string
  projectWorth: string
  status: string
  workType: string
  planWorkDayStart: string
  planWorkDayEnd: string
  actualWorkDayStart: string
  actualWorkDayEnd: string
  tags: string[]
  report: string
  documents: string[]
  workLog?: WorkLogEntry[]
  createdAt?: string
  updatedAt?: string
  __v?: number
}
