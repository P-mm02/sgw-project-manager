// src/app/ManageNotification/CreateNotify/Function.ts

// Thai months (for dropdown)
export const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

// Get number of days in a month
export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

// Get today as YYYY-MM-DD string
export function todayISODate() {
  const d = new Date()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// Convert ISO date to Thai-style string
export function thaiDateString(iso: string) {
  if (!iso) return '-'
  const d = new Date(iso)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear() + 543
  return `${day}/${month}/${year}`
}
