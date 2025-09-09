'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './page.css'
import Link from 'next/link'

/** =============================
 *  Types
 *  ============================= */
type Member = { _id: string; name: string }

type ScheduleEntry = {
  startDate: string // YYYY-MM-DD (local BKK)
  endDate: string // YYYY-MM-DD (local BKK)
  memberIds: string[]
  note?: string
}

type Project = {
  _id: string
  projectName: string
  schedule: ScheduleEntry[]
}

/** =============================
 *  Timezone / date helpers (Bangkok)
 *  ============================= */
const BKK_TZ = 'Asia/Bangkok'

/** Return YYYY-MM-DD in Bangkok local time. */
const toLocalDateString = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: BKK_TZ })

/** Build all Date objects for the visible month using local month/year. */
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

/** Local date math (no UTC drift) */
function parseYMD(str: string): { y: number; m: number; d: number } {
  const [y, m, d] = str.split('-').map(Number)
  return { y, m, d }
}
function makeLocalDate(ymd: string): Date {
  const { y, m, d } = parseYMD(ymd)
  return new Date(y, m - 1, d)
}
function cmpYMD(a: string, b: string) {
  return a < b ? -1 : a > b ? 1 : 0
}
function clampDateStr(dateStr: string, minStr: string, maxStr: string) {
  if (cmpYMD(dateStr, minStr) < 0) return minStr
  if (cmpYMD(dateStr, maxStr) > 0) return maxStr
  return dateStr
}
function addDaysYMD(ymd: string, days: number): string {
  const d = makeLocalDate(ymd)
  d.setDate(d.getDate() + days)
  return toLocalDateString(d)
}
/** Inclusive #days from a->b (YYYY-MM-DD, a<=b). */
function inclusiveSpanDays(a: string, b: string): number {
  const da = makeLocalDate(a)
  const db = makeLocalDate(b)
  const ms = db.getTime() - da.getTime()
  return Math.floor(ms / 86400000) + 1
}
/** 0-based index of a date inside the current month window */
function dayIndexFromMonthStart(dayStr: string, monthStartStr: string) {
  return inclusiveSpanDays(monthStartStr, dayStr) - 1
}

/** =============================
 *  Page Component
 *  ============================= */
const OperationalPlanPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'project' | 'member'>('project')

  const [members, setMembers] = useState<Member[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch members + projects from API routes
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const [mRes, pRes] = await Promise.all([
          fetch('/api/OperationalPlan/member/get', { cache: 'no-store' }),
          fetch('/api/OperationalPlan/project/get', { cache: 'no-store' }),
        ])
        if (!mRes.ok) throw new Error(`Member HTTP ${mRes.status}`)
        if (!pRes.ok) throw new Error(`Project HTTP ${pRes.status}`)
        const [{ members }, { projects }] = await Promise.all([
          mRes.json(),
          pRes.json(),
        ])
        if (cancelled) return
        setMembers(members as Member[])
        setProjects(projects as Project[])
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Load failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const daysInMonth = useMemo(
    () => buildDaysInMonth(currentDate),
    [currentDate]
  )

  const monthStartStr = toLocalDateString(daysInMonth[0])
  const monthEndStr = toLocalDateString(daysInMonth[daysInMonth.length - 1])

  const memberMap = useMemo(() => {
    const map = new Map<string, string>()
    members.forEach((m) => map.set(m._id, m.name))
    return map
  }, [members])

  /** Month navigation */
  const handleMonthChange = (offset: number) => {
    setCurrentDate((prev) => {
      const next = new Date(prev)
      next.setDate(1)
      next.setMonth(next.getMonth() + offset)
      return next
    })
  }

  /** Weekday initial for header */
  const getDayInitial = (date: Date) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    return days[date.getDay()]
  }

  /** Today check using local YYYY-MM-DD */
  const isToday = (date: Date) => {
    const today = toLocalDateString(new Date())
    return toLocalDateString(date) === today
  }

  /** ------------ PROJECT VIEW (CSS Grid lanes) ------------ */
  const renderProjectView = () => {
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
            {projects.map((project) => {
              return (
                <tr key={project._id}>
                  <td className="sticky-col cell-project">
                    {project.projectName}
                  </td>

                  {/* ONE grid cell spans all days; CSS Grid will auto-stack overlaps */}
                  <td className="grid-cell" colSpan={daysInMonth.length}>
                    {/* today marker column inside the grid */}
                    {todayIdx >= 0 && (
                      <div
                        className="today-marker-abs"
                        style={
                          {
                            // 0-based column index -> used in CSS calc()
                            ['--col' as any]: todayIdx,
                          } as React.CSSProperties
                        }
                      />
                    )}

                    <div
                      className="row-grid"
                      style={
                        {
                          ['--days' as any]: daysInMonth.length, // expose day count to CSS
                        } as React.CSSProperties
                      }
                    >
                      {/* bars */}
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
                        const endIdx = dayIndexFromMonthStart(
                          end,
                          monthStartStr
                        )

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
                                  <div className="note-text text-wrap">
                                    {note}
                                  </div>
                                )}
                              </>
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

  /** ------------ MEMBER VIEW (CSS Grid lanes, like Project View) ------------ */
  const renderMemberView = () => {
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
              // Build this member's bars from all projects' schedules
              const bars: Array<{
                start: string
                end: string
                projectName: string
                note?: string
              }> = []

              projects.forEach((p) => {
                p.schedule.forEach((s) => {
                  if (!s.memberIds.includes(member._id)) return
                  // clamp to visible month window
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

                  {/* ONE grid cell spans all days; bars auto-stack when overlapping */}
                  <td className="grid-cell" colSpan={daysInMonth.length}>
                    {/* full-height today overlay aligned to the day column */}
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
                              <div className="note-text text-wrap">
                                {b.note}
                              </div>
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

  if (loading) {
    return (
      <div className="plan-container">
        <header className="plan-header">
          <h1>แผนปฏิบัติงาน</h1>
        </header>
        <main>
          <p>Loading…</p>
        </main>
      </div>
    )
  }
  if (error) {
    return (
      <div className="plan-container">
        <header className="plan-header">
          <h1>แผนปฏิบัติงาน</h1>
        </header>
        <main>
          <p className="error">Error: {error}</p>
        </main>
      </div>
    )
  }

  return (
    <div className="plan-container">
      <header className="plan-header">
        <h1>แผนปฏิบัติงาน</h1>
        <div className="data-management">
          <Link href="/OperationalPlan/addMember" className="dm-link">
            บุคลากร
          </Link>
          <Link href="/OperationalPlan/addProject" className="dm-link">
            โครงการ
          </Link>
        </div>

        <div className="controls">
          <div className="month-selector">
            <button onClick={() => handleMonthChange(-1)}>&lt;</button>
            <span>
              {currentDate.toLocaleString('th-TH', {
                month: 'long',
                year: 'numeric',
                calendar: 'buddhist',
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
