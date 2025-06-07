'use client'
import React from 'react'
import './DateCtrl.css'
import { Month } from '../ProjectDP/generateMonths/generateMonths'

type DateCtrlProps = {
  monthCount: number
  months: Month[]
  planRange: { start: string; end: string }
  actualRange: { start: string; end: string }
}

export default function DateCtrl({ monthCount, months, planRange, actualRange }: DateCtrlProps) {
  return (
    <>
      <div
        className={`project-action-plan row ${
          monthCount === 1 ? 'show-day-number' : ''
        }`}
      >
        {months.map((month, i) => (
          <div
            className="bar-scale-month plan"
            key={`plan-${i}`}
            style={{ gridTemplateColumns: `repeat(${month.days.length}, 1fr)` }}
          >
            {month.days.map((day) => {
              const isInPlan =
                day.id >= planRange.start && day.id <= planRange.end
              return (
                <div
                  className={`bar-scale-day plan ${
                    isInPlan ? 'plan-highlight' : ''
                  }`}
                  key={day.id}
                  id={day.id}
                >
                  <span className="day-number">{day.label}</span>
                </div>
              )
            })}
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
            className="bar-scale-month actual"
            key={`actual-${i}`}
            style={{ gridTemplateColumns: `repeat(${month.days.length}, 1fr)` }}
          >
            {month.days.map((day) => {
              const isInActual =
                day.id >= actualRange.start && day.id <= actualRange.end
              return (
                <div
                  className={`bar-scale-day actual ${
                    isInActual ? 'actual-highlight' : ''
                  }`}
                  key={day.id}
                >
                  <span className="day-number">{day.label}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}
