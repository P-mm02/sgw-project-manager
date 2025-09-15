'use client'

import React from 'react'
import type { Project } from '../types'
import {
  toLocalDateString,
  getDayInitial,
  isToday,
  clampDateStr,
  cmpYMD,
  dayIndexFromMonthStart,
} from '../utils/date'

type Props = {
  projects: Project[]
  daysInMonth: Date[]
  monthStartStr: string
  monthEndStr: string
  memberMap: Map<string, string>
  onDayClick: (projectId: string, dayStr: string) => void
}

export default function ProjectView({
  projects,
  daysInMonth,
  monthStartStr,
  monthEndStr,
  memberMap,
  onDayClick,
}: Props) {
  const todayIdx = daysInMonth.findIndex((d) => isToday(d))

  return (
    <div className="table-container">
      <table className="operational-table">
        <colgroup>
          <col className="col-sticky" />
          {daysInMonth.map((_, i) => (
            <col key={`proj-col-${i}`} className="col-day" />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th className="sticky-col header-project">Project</th>
            {daysInMonth.map((day) => {
              const key = day.getTime()
              return (
                <th
                  key={key}
                  className={`header-date ${isToday(day) ? 'today' : ''}`}
                >
                  <div className="date-cell-content">
                    <span className="day-initial">{getDayInitial(day)}</span>
                    <span className="day-number">{day.getDate()}</span>
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td className="sticky-col cell-project">{project.projectName}</td>

              {/* ONE grid cell spans all days; CSS Grid will auto-stack overlaps */}
              <td className="grid-cell" colSpan={daysInMonth.length}>
                {/* Full-height today overlay aligned to the day column */}
                {todayIdx >= 0 && (
                  <div
                    className="today-marker-abs"
                    style={
                      { ['--col' as any]: todayIdx } as React.CSSProperties
                    }
                  />
                )}

                <div
                  className="row-grid"
                  style={
                    {
                      ['--days' as any]: daysInMonth.length,
                    } as React.CSSProperties
                  }
                >
                  {/* Click layer: one invisible button per day (under bars) */}
                  {daysInMonth.map((day, i) => {
                    const dayStr = toLocalDateString(day)
                    return (
                      <button
                        key={`hit-${project._id}-${i}`}
                        className="hit-cell"
                        title={`Add schedule on ${dayStr}`}
                        aria-label={`Add schedule on ${dayStr}`}
                        type="button"
                        onClick={() => onDayClick(project._id, dayStr)}
                        style={{ gridColumn: `${i + 1} / ${i + 2}` }}
                      >
                        +
                      </button>
                    )
                  })}

                  {/* Bars (render above click layer) */}
                  {project.schedule.map((s, idx) => {
                    // clamp to visible month
                    const start = clampDateStr(
                      s.startDate,
                      monthStartStr,
                      monthEndStr
                    )
                    const end = clampDateStr(
                      s.endDate,
                      monthStartStr,
                      monthEndStr
                    )
                    if (cmpYMD(start, end) > 0) return null // out of view

                    const startIdx = dayIndexFromMonthStart(
                      start,
                      monthStartStr
                    )
                    const endIdx = dayIndexFromMonthStart(end, monthStartStr)

                    const memberNames = s.memberIds.map(
                      (id) => memberMap.get(id) ?? id
                    )
                    const note = (s.note || '').trim()
                    const hasAny = memberNames.length > 0 || note.length > 0

                    return (
                      <div
                        key={`${project._id}-bar-${idx}`}
                        className="grid-bar"
                        style={{
                          gridColumn: `${startIdx + 1} / ${endIdx + 2}`,
                        }}
                        title={note || undefined}
                      >
                        {hasAny && (
                          <>
                            {memberNames.length > 0 && (
                              <div className="member-tag text-wrap">
                                {memberNames.join(', ')}
                              </div>
                            )}
                            {note && (
                              <div className="note-text text-wrap">{note}</div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
