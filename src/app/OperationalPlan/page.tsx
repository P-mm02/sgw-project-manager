'use client'

import React, { useMemo, useState } from 'react'
import membersData from './member.json'
import projectsData from './project.json'
import './page.css'

/** =============================
 *  Types
 *  ============================= */
type Member = {
  _id: string
  name: string
}

type ScheduleEntry = {
  date: string // YYYY-MM-DD (Bangkok local)
  _id: string // member _id
  memberName: string // denormalized name for fast rendering
}

type Project = {
  projectId: string
  projectName: string
  schedule: ScheduleEntry[]
}

/** =============================
 *  Timezone helpers (Bangkok)
 *  ============================= */
const BKK_TZ = 'Asia/Bangkok'

/** Return YYYY-MM-DD in Bangkok local time */
const toLocalDateString = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: BKK_TZ }) // en-CA => YYYY-MM-DD

/** Build all Date objects for the visible month (using local month/year) */
function buildDaysInMonth(anchor: Date) {
  // Work with a copy set to local first-of-month
  const year = anchor.getFullYear()
  const month = anchor.getMonth()

  const start = new Date(year, month, 1)
  const days: Date[] = []
  const d = new Date(start)

  while (d.getMonth() === month) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

/** =============================
 *  Component
 *  ============================= */
const OperationalPlanPage = () => {
  // Use actual "now". If you want a fixed demo date, set new Date('2025-09-05T00:00:00+07:00')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'project' | 'member'>('project')

  const members: Member[] = membersData
  const projects: Project[] = projectsData

  /** Days in current visible month (local) */
  const daysInMonth = useMemo(
    () => buildDaysInMonth(currentDate),
    [currentDate]
  )

  /** Member map for quick formatting/lookup
      We map both (_id -> name) and (name -> name) so project view can call:
      memberMap.get(scheduleEntry.memberName) without hitting member.json per cell. */
  const memberMap = useMemo(() => {
    const map = new Map<string, string>()
    members.forEach((m) => {
      map.set(m._id, m.name)
      map.set(m.name, m.name)
    })
    return map
  }, [members])

  const handleMonthChange = (offset: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(1) // avoid month-roll issues
      next.setMonth(next.getMonth() + offset)
      return next
    })
  }

  const getDayInitial = (date: Date) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[date.getDay()]
  }

  /** Today check in Bangkok local */
  const isToday = (date: Date) => {
    const today = toLocalDateString(new Date())
    return toLocalDateString(date) === today
  }

  /** ------------ PROJECT VIEW ------------ */
  const renderProjectView = () => (
    <div className="table-container">
      <table className="operational-table">
        <thead>
          <tr>
            <th className="sticky-col header-project">Project</th>
            {daysInMonth.map((day) => {
              const key = day.getTime() // stable key without UTC shifts
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
            <tr key={project.projectId}>
              <td className="sticky-col cell-project">{project.projectName}</td>
              {daysInMonth.map((day) => {
                const key = day.getTime()
                const yyyyMmDd = toLocalDateString(day)

                const scheduleEntry = project.schedule.find(
                  (s) => s.date === yyyyMmDd
                )

                // No per-cell member.json lookup; rely on denormalized memberName and optional formatting via map
                const memberName = scheduleEntry
                  ? memberMap.get(scheduleEntry.memberName) ??
                    scheduleEntry.memberName
                  : ''

                return (
                  <td
                    key={key}
                    className={`data-cell ${memberName ? 'has-data' : ''} ${
                      isToday(day) ? 'today-cell' : ''
                    }`}
                  >
                    {memberName && (
                      <div className="member-tag">{memberName}</div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  /** ------------ MEMBER VIEW ------------ */
  const renderMemberView = () => {
    // index by (YYYY-MM-DD-<member _id>) => projectName
    const projectScheduleMap = new Map<string, string>()
    projects.forEach((p) => {
      p.schedule.forEach((s) => {
        const key = `${s.date}-${s._id}`
        projectScheduleMap.set(key, p.projectName)
      })
    })

    return (
      <div className="table-container">
        <table className="operational-table">
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
            {members.map((member) => (
              <tr key={member._id}>
                <td className="sticky-col cell-project">{member.name}</td>
                {daysInMonth.map((day) => {
                  const key = day.getTime()
                  const yyyyMmDd = toLocalDateString(day)
                  const matchProjectName = projectScheduleMap.get(
                    `${yyyyMmDd}-${member._id}`
                  )

                  return (
                    <td
                      key={key}
                      className={`data-cell ${
                        matchProjectName ? 'has-data' : ''
                      } ${isToday(day) ? 'today-cell' : ''}`}
                    >
                      {matchProjectName && (
                        <div className="project-tag">{matchProjectName}</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="plan-container">
      <header className="plan-header">
        <h1>Operational Plan</h1>
        <div className="controls">
          <div className="month-selector">
            <button onClick={() => handleMonthChange(-1)}>&lt;</button>
            <span>
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
                timeZone: BKK_TZ,
              })}
            </span>
            <button onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>
          <div className="view-switcher">
            <button
              className={view === 'project' ? 'active' : ''}
              onClick={() => setView('project')}
            >
              Project View
            </button>
            <button
              className={view === 'member' ? 'active' : ''}
              onClick={() => setView('member')}
            >
              Member View
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === 'project' ? renderProjectView() : renderMemberView()}
      </main>
    </div>
  )
}

export default OperationalPlanPage
