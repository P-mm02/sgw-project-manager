'use client'
import { startOfMonth, endOfMonth } from 'date-fns'

export type Month = {
  key: string // "202506"
  label: string // "มิ.ย. 2568"
  startDate: Date
  endDate: Date
}

const thaiMonths = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
]

/**
 * Generate an array of months starting from `monthSelect` (1-based), spanning `monthCount` months
 */
export function generateMonths(
  monthCount: number,
  monthSelect: number, // 1 = January
  year: number
): Month[] {
  return Array.from({ length: monthCount }, (_, i) => {
    const currentMonth = monthSelect  + i
    const date = new Date(year, currentMonth, 1)
    const y = date.getFullYear()
    const m = date.getMonth()

    return {
      key: `${y}${String(m + 1).padStart(2, '0')}`,
      label: `${thaiMonths[m]} ${y + 543}`,
      startDate: startOfMonth(date),
      endDate: endOfMonth(date),
    }
  })
}
