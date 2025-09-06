'use client'

import React, { useMemo, useState } from 'react'
import membersData from './member.json'
import projectsData from './project.json'
import './page.css'

/** =============================
 *  Types
 *  =============================
 *  Member: normalized directory of people.
 *  ScheduleEntry: per-day assignment. We keep BOTH:
 *    - memberIds[]  : authoritative references (DB integrity, joins)
 *    - memberNames[]: denormalized strings for fast rendering (no lookup)
 *  Project: a project with a calendar of schedule entries.
 */
type Member = {
  _id: string
  name: string
}

type ScheduleEntry = {
  date: string // YYYY-MM-DD in local (Bangkok) time; must match toLocalDateString()
  memberIds: string[] // list of member _id (primary/authoritative)
  memberNames: string[] // list of display names (denormalized for quick render)
  note?: string // optional note shown under names on a second line
}

type Project = {
  projectId: string
  projectName: string
  schedule: ScheduleEntry[]
}

/** =============================
 *  Timezone helpers (Bangkok)
 *  =============================
 *  IMPORTANT:
 *  - Never use toISOString().split('T')[0] for day keys in Thailand;
 *    ISO uses UTC and will shift your date by -7 hours, causing a 1-day drift.
 *  - We always derive keys as local YYYY-MM-DD in Asia/Bangkok.
 */
const BKK_TZ = 'Asia/Bangkok'

/**
 * Return YYYY-MM-DD in Bangkok local time.
 * We use 'en-CA' locale because it formats as ISO-like "YYYY-MM-DD".
 * This string is our canonical day key across the app.
 */
const toLocalDateString = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: BKK_TZ }) // en-CA => YYYY-MM-DD

/**
 * Build all Date objects for the visible month using local month/year.
 * We iterate from the 1st to the last day of the current month.
 * Note: We keep Date objects for rendering (weekday initials, numbers),
 *       but all equality/joins use toLocalDateString() for safety.
 */
function buildDaysInMonth(anchor: Date) {
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
  /**
   * currentDate:
   * - Drives which month is rendered.
   * - If you want a reproducible demo, use:
   *   new Date('2025-09-05T00:00:00+07:00')
   */
  const [currentDate, setCurrentDate] = useState(new Date())

  /**
   * view:
   * - 'project'  = rows are projects, columns are days
   * - 'member'   = rows are members, columns are days
   */
  const [view, setView] = useState<'project' | 'member'>('project')

  // Source data (JSON). Cast for strong typing.
  const members = membersData as Member[]
  const projects = projectsData as Project[]

  /**
   * daysInMonth:
   * - Recomputed only when currentDate changes (useMemo).
   * - Array of Date objects for each visible day.
   */
  const daysInMonth = useMemo(
    () => buildDaysInMonth(currentDate),
    [currentDate]
  )

  /**
   * memberMap:
   * - Convenience map to format names.
   * - We map:
   *     (_id -> name) for ID-based lookups
   *     (name -> name) for denormalized-name passthrough (no extra hits)
   * - The second mapping means scheduleEntry.memberNames can be plugged in directly,
   *   but still formatted via the map if you later want per-member transforms (e.g. aliases).
   */
  const memberMap = useMemo(() => {
    const map = new Map<string, string>()
    members.forEach((m) => {
      map.set(m._id, m.name) // canonical ID -> name
      map.set(m.name, m.name) // name passthrough (keeps project-view fast)
    })
    return map
  }, [members])

  /**
   * Month navigation:
   * - Set date to day 1 first to avoid month-end rollover bugs.
   */
  const handleMonthChange = (offset: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(1)
      next.setMonth(next.getMonth() + offset)
      return next
    })
  }

  /** Render "S,M,T,W,T,F,S" weekday initial for header. */
  const getDayInitial = (date: Date) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[date.getDay()]
  }

  /**
   * isToday:
   * - Compares local YYYY-MM-DD strings in Asia/Bangkok.
   * - Avoids UTC drift that causes "today" highlight to shift a day.
   */
  const isToday = (date: Date) => {
    const today = toLocalDateString(new Date())
    return toLocalDateString(date) === today
  }

  /** ------------ PROJECT VIEW ------------
   *  Rows:    projects
   *  Columns: days of the visible month
   *  Cell:    member names (first line) + note (second line)
   *
   *  Performance note:
   *  - We do a simple .find() per cell; fine for small/medium data.
   *  - For very large months/projects, consider pre-indexing each project's
   *    schedule to a Map<YYYY-MM-DD, ScheduleEntry> to achieve O(1) cell lookup.
   */
  const renderProjectView = () => (
    <div className="table-container">
      <table className="operational-table">
        <thead>
          <tr>
            <th className="sticky-col header-project">Project</th>
            {daysInMonth.map((day) => {
              // Use getTime() as a stable key; avoids timezone/ISO surprises.
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
            <tr key={project.projectId}>
              {/* Sticky left column with project name */}
              <td className="sticky-col cell-project">{project.projectName}</td>

              {/* One cell per day */}
              {daysInMonth.map((day) => {
                const key = day.getTime()
                const yyyyMmDd = toLocalDateString(day)

                // Find schedule (if any) for this exact local day
                const scheduleEntry = project.schedule.find(
                  (s) => s.date === yyyyMmDd
                )

                // Render line 1: names, mapped/passthrough via memberMap
                const memberNames =
                  scheduleEntry?.memberNames.map(
                    (n) => memberMap.get(n) ?? n
                  ) ?? []

                // Render line 2: optional note
                const note = (scheduleEntry?.note || '').trim()

                // If we have either names or a note, mark cell as "has-data"
                const hasAny = memberNames.length > 0 || note.length > 0

                return (
                  <td
                    key={key}
                    className={`data-cell ${hasAny ? 'has-data' : ''} ${
                      isToday(day) ? 'today-cell' : ''
                    }`}
                    // Title as a quick hover tooltip for longer notes
                    title={note ? note : undefined}
                  >
                    {hasAny && (
                      <div className="cell-lines">
                        {/* Line 1: comma-joined names (swap to individual pills if desired) */}
                        {memberNames.length > 0 && (
                          <div className="member-tag text-wrap">
                            {memberNames.join(', ')}
                          </div>
                        )}
                        {/* Line 2: note, styled subtly under names */}
                        {note && (
                          <div className="note-text text-wrap">{note}</div>
                        )}
                      </div>
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

  /** ------------ MEMBER VIEW ------------
   *  Rows:    members
   *  Columns: days of the visible month
   *  Cell:    project name if the member is assigned that day
   *
   *  We precompute a Map<YYYY-MM-DD-<memberId>, projectName> for O(1) lookups.
   */
  const renderMemberView = () => {
    // Pre-index all assignments for quick per-cell checks
    const projectScheduleMap = new Map<string, string>()
    projects.forEach((p) => {
      p.schedule.forEach((s) => {
        s.memberIds.forEach((id) => {
          const key = `${s.date}-${id}`
          projectScheduleMap.set(key, p.projectName)
        })
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
                {/* Sticky left column with member name */}
                <td className="sticky-col cell-project">{member.name}</td>

                {/* One cell per day */}
                {daysInMonth.map((day) => {
                  const key = day.getTime()
                  const yyyyMmDd = toLocalDateString(day)

                  // O(1) lookup using pre-indexed map
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
                        <div className="project-tag text-wrap">
                          {matchProjectName}
                        </div>
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

        {/* Controls: month navigation + view switcher */}
        <div className="controls">
          {/* Month selector: previous / current month label / next */}
          <div className="month-selector">
            <button onClick={() => handleMonthChange(-1)}>&lt;</button>
            <span>
              {currentDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
                timeZone: BKK_TZ, // Render label in Bangkok time
              })}
            </span>
            <button onClick={() => handleMonthChange(1)}>&gt;</button>
          </div>

          {/* Toggle between Project and Member views */}
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

      {/* Main table content based on current view */}
      <main>
        {view === 'project' ? renderProjectView() : renderMemberView()}
      </main>
    </div>
  )
}

export default OperationalPlanPage
