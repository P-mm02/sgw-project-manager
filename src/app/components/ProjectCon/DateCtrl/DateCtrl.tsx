/* 'use client'

import {
  format,
  addDays,
  startOfYear,
  endOfYear,
  differenceInDays,
} from 'date-fns'

export default function DateCtrl() {
  const currentYear = new Date().getFullYear()
  const startDate = startOfYear(new Date(currentYear, 0, 1))
  const endDate = endOfYear(new Date(currentYear, 0, 1))
  const totalDays = differenceInDays(endDate, startDate) + 1

  const days = Array.from({ length: totalDays }, (_, i) =>
    addDays(startDate, i)
  )

  return (
    <div className="flex flex-wrap gap-[1px] text-xs leading-none text-center">
      {days.map((date, i) => {
        const id = format(date, 'yyyyMMdd')
        const dayNumber = format(date, 'd') // e.g., 1–31
        const isMilestone = i % 30 === 0

        return (
          <div
            key={`plan-${i}`}
            id={id}
            className={`bar-scale plan w-6 h-6 flex items-center justify-center rounded ${
              isMilestone ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            title={format(date, 'MMMM d, yyyy')}
          >
            {dayNumber}
          </div>
        )
      })}
    </div>
  )
}
 */
'use client'
import React from 'react'

type DateCtrlProps = {
  monthCount: number
}

export default function DateCtrl({ monthCount }: DateCtrlProps) {
  return (
    <>
      <div className="project-action-plan row">
        {[...Array(monthCount)].map((_, i) => (
          <div className="bar-scale plan" key={`plan-${i}`}>

          </div>
        ))}
      </div>
      <div className="project-actual-work row">
        {[...Array(monthCount)].map((_, i) => (
          <div className="bar-scale actual" key={`actual-${i}`}></div>
        ))}
      </div>
    </>
  )
}
