'use client'

import React from 'react'
import { differenceInCalendarDays, parse } from 'date-fns'
import './DateCtrl.css'
import { formatStartEndDate } from '@/lib/date/formatStartEndDate'

type DateRange = {
  start: string
  end: string
}

type Month = {
  key: string // e.g., "202506"
  label: string // e.g., "มิ.ย. 2568"
  startDate: Date // e.g., new Date(2025, 5, 1)
  endDate: Date // e.g., new Date(2025, 5, 30)
}

type Props = {
  months: Month[]
  monthCount: number
  planRange: DateRange
  actualRange: DateRange
}

export default function DateCtrl({ months, planRange, actualRange }: Props) {
  if (!months.length) return null

  const timelineStart = months[0].startDate
  const timelineEnd = months[months.length - 1].endDate

  const calcBarStyle = (range: DateRange) => {
    if (!range.start || !range.end || !timelineStart || !timelineEnd) {
      return { display: 'none' }
    }

    const start = parse(range.start, 'yyyyMMdd', new Date())
    const end = parse(range.end, 'yyyyMMdd', new Date())

    // Completely outside the timeline
    if (end < timelineStart || start > timelineEnd) {
      return { display: 'none' }
    }

    const totalDays = differenceInCalendarDays(timelineEnd, timelineStart) + 1

    // Clamp range within timeline
    const clampedStart = start < timelineStart ? timelineStart : start
    const clampedEnd = end > timelineEnd ? timelineEnd : end

    const offsetDays = differenceInCalendarDays(clampedStart, timelineStart)
    const visibleDuration = Math.max(
      1,
      differenceInCalendarDays(clampedEnd, clampedStart) + 1
    )

    const leftPercent = (offsetDays / totalDays) * 100
    const widthPercent = (visibleDuration / totalDays) * 100

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
    }
  }
    
  return (
    <div className="date-timeline-wrapper">
      <div className="timeline-months" style={{ display: 'none' }}>
        {months.map((m) => (
          <div key={m.key} className="timeline-month">
            {m.label}
          </div>
        ))}
      </div>

      <div className="timeline-bars">
        <div className="timeline-months" style={{ display: '' }}>
          {months.map((m) => (
            <div key={m.key} className="timeline-month">
              {}
            </div>
          ))}
        </div>
        <div className="timeline-bar plan" style={calcBarStyle(planRange)}>
          <div className="timeRangeCon">
            <span className="timeRange">
              {formatStartEndDate(planRange.start)} ถึง{' '}
              {formatStartEndDate(planRange.end)}
            </span>
          </div>
        </div>
        <div className="timeline-bar actual" style={calcBarStyle(actualRange)}>
          <div className="timeRangeCon">
            <span className="timeRange">
              {formatStartEndDate(actualRange.start)} ถึง{' '}
              {formatStartEndDate(actualRange.end)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
