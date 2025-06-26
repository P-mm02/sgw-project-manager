'use client'
import React from 'react'
import './DateCtrl.css'
import { Month } from '../generateMonths/generateMonths'

type DateCtrlProps = {
  monthCount: number
  months: Month[]
  planRange: { start: string; end: string }
  actualRange: { start: string; end: string }
}

function renderDateBar(
  type: 'plan' | 'actual',
  monthCount: number,
  months: Month[],
  range: { start: string; end: string }
) {
  return (
    <div
      className={`project-${
        type === 'plan' ? 'action-plan' : 'actual-work'
      } row ${monthCount === 1 ? 'show-day-number' : ''}`}
    >
      {months.map((month, i) => {
        return (
          <div
            className={`bar-scale-month ${type} bar-scale-${monthCount}month`}
            key={`${type}-${i}`}
            style={{ gridTemplateColumns: `repeat(${month.days.length}, 1fr)` }}
          >
            {month.days.map((day) => {
              const isInRange = day.id >= range.start && day.id <= range.end
              const highlightClass = isInRange ? ` ${type}-highlight` : ''

              return (
                <div
                  className={`bar-scale-day-wrapper${highlightClass}`}
                  key={day.id}
                >
                  <div
                    className={`bar-scale-day ${type}${highlightClass}`}
                    id={day.id}
                  >
                    <span className="day-number">{day.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function DateCtrl({
  monthCount,
  months,
  planRange,
  actualRange,
}: DateCtrlProps) {
  return (
    <>
      {renderDateBar('plan', monthCount, months, planRange)}
      {renderDateBar('actual', monthCount, months, actualRange)}
    </>
  )
}

