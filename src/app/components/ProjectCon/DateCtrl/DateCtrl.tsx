'use client'
import React, { useMemo, useEffect } from 'react'
import './DateCtrl.css'
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'

type DateCtrlProps = {
  monthCount: number
  monthSelect: number
}

export default function DateCtrl({ monthCount, monthSelect }: DateCtrlProps) {
  const selectYear = new Date().getFullYear()

  const months = useMemo(() => {
    return Array.from({ length: monthCount }, (_, i) => {
      const targetMonth = monthSelect + i
      const firstDay = startOfMonth(new Date(selectYear, targetMonth, 1))
      const lastDay = endOfMonth(firstDay)
      const days = eachDayOfInterval({ start: firstDay, end: lastDay })
      console.log('monthSelect:', monthSelect)
      console.log('monthCount:', monthCount)
      console.log('selectYear:', selectYear)
      console.log('***************************************************')
      return {
        name: format(firstDay, 'MMMM'),
        days: days.map((day) => ({
          label: format(day, 'd'),
          id: format(day, 'yyyyMMdd'),
        })),
      }
    })
  }, [monthCount, monthSelect, selectYear])

  /* useEffect(() => {
    console.log('monthSelect:', monthSelect)
    console.log('monthCount:', monthCount)
    console.log('selectYear:', selectYear)
    console.log('First day:', months[0]?.days[0]?.label)
    console.log('Last day:', months[0]?.days.at(-1)?.label)
    console.log('***************************************************')
  }, [monthCount, monthSelect, months, selectYear]) */

  return (
    <>
      <div
        className={`project-action-plan row ${
          monthCount === 1 ? 'show-day-number' : ''
        }`}
      >
        {months.map((month, i) => (
          <div
            className="bar-scale-month"
            key={`plan-${i}`}
            style={{ gridTemplateColumns: `repeat(${month.days.length}, 1fr)` }}
          >
            {month.days.map((day) => (
              <div className="bar-scale-day" key={day.id} id={day.id}>
                <span className="day-number">{day.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        className={`project-actual-work row ${
          monthCount === 1 ? 'show-day-number' : ''
        }`}
      >
        {months.map((month, i) => (
          <div
            className="bar-scale-month"
            key={`actual-${i}`}
            style={{ gridTemplateColumns: `repeat(${month.days.length}, 1fr)` }}
          >
            {month.days.map((day) => (
              <div className="bar-scale-day" key={day.id}>
                <span className="day-number">{day.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
