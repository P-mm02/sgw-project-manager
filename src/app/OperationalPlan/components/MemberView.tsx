'use client'

import React from 'react'
import type { Member, Project } from '../types'
import {
  getDayInitial,
  isToday,
  clampDateStr,
  cmpYMD,
  dayIndexFromMonthStart,
} from '../utils/date'

type Props = {
  members: Member[]
  projects: Project[]
  daysInMonth: Date[]
  monthStartStr: string
  monthEndStr: string
}

export default function MemberView({
  members,
  projects,
  daysInMonth,
  monthStartStr,
  monthEndStr,
}: Props) {
  const todayIdx = daysInMonth.findIndex((d) => isToday(d))

  return (
    <div className="table-container">
      <table className="operational-table">
        <colgroup>
          <col className="col-sticky" />
          {daysInMonth.map((_, i) => (
            <col key={`m-col-${i}`} className="col-day" />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th className="sticky-col header-project">Member</th>
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
          {members.map((member) => {
            const bars: Array<{
              start: string
              end: string
              projectName: string
              note?: string
            }> = []

            projects.forEach((p) => {
              p.schedule.forEach((s) => {
                if (!s.memberIds.includes(member._id)) return
                const start = clampDateStr(
                  s.startDate,
                  monthStartStr,
                  monthEndStr
                )
                const end = clampDateStr(s.endDate, monthStartStr, monthEndStr)
                if (cmpYMD(start, end) > 0) return
                bars.push({
                  start,
                  end,
                  projectName: p.projectName,
                  note: s.note?.trim(),
                })
              })
            })

            return (
              <tr key={member._id}>
                <td className="sticky-col cell-project">{member.name}</td>

                <td className="grid-cell" colSpan={daysInMonth.length}>
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
                    {bars.map((b, i) => {
                      const startIdx = dayIndexFromMonthStart(
                        b.start,
                        monthStartStr
                      )
                      const endIdx = dayIndexFromMonthStart(
                        b.end,
                        monthStartStr
                      )
                      return (
                        <div
                          key={`${member._id}-bar-${i}`}
                          className="grid-bar"
                          style={{
                            gridColumn: `${startIdx + 1} / ${endIdx + 2}`,
                          }}
                          title={b.note || undefined}
                        >
                          <div className="project-tag text-wrap">
                            {b.projectName}
                          </div>
                          {b.note && (
                            <div className="note-text text-wrap">{b.note}</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
