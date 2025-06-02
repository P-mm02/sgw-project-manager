'use client'
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'

export type Month = {
  name: string
  days: {
    label: string
    id: string
  }[]
}

/**
 * Generate an array of months starting from `monthSelect`, spanning `monthCount` months
 *
 * @param monthCount number of months to generate
 * @param monthSelect starting month (0 = January)
 * @param year optional (default is current year)
 * @returns array of month data
 */
export function generateMonths(
  monthCount: number,
  monthSelect: number,
  year: number = new Date().getFullYear()
): Month[] {
  return Array.from({ length: monthCount }, (_, i) => {
    const targetMonth = monthSelect + i
    const firstDay = startOfMonth(new Date(year, targetMonth, 1))
    const lastDay = endOfMonth(firstDay)
    const days = eachDayOfInterval({ start: firstDay, end: lastDay })
    return {
      name: format(firstDay, 'MMMM'),
      days: days.map((day) => ({
        label: format(day, 'd'),
        id: format(day, 'yyyyMMdd'),
      })),
    }
  })
}
