'use client'
import React from 'react'
import './DateCtrl.css'
import { Month } from '../ProjectDP/generateMonths/generateMonths'

type DateCtrlProps = {
  monthCount: number
  months: Month[]
}

export default function DateCtrl({ monthCount, months }: DateCtrlProps) {
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
