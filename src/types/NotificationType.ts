// src/types/NotificationType.ts

export type NotificationType = {
  _id?: string
  title: string
  detail?: string
  notifyDate: string
  notifyBeforeDays?: number[]
  notifiedDays?: number[]
  isNotified?: boolean
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}
