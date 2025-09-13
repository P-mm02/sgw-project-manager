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
function inclusiveSpanDays(a: string, b: string): number {
  const da = makeLocalDate(a)
  const db = makeLocalDate(b)
  const ms = db.getTime() - da.getTime()
  return Math.floor(ms / 86400000) + 1
}
function dayIndexFromMonthStart(dayStr: string, monthStartStr: string) {
  return inclusiveSpanDays(monthStartStr, dayStr) - 1
}

/** =============================
 *  Quick-Add Modal
 *  ============================= */
function ScheduleQuickAddModal({
  projectId,
  initialDate,
  members,
  onClose,
  onSaved,
}: {
  projectId: string
  initialDate: string
  members: Member[]
  onClose: () => void
  onSaved: (p: Project) => void
}) {
  const [startDate, setStartDate] = useState(initialDate)
  const [endDate, setEndDate] = useState(initialDate)
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Close with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const onChangeStart = (v: string) => {
    setStartDate(v)
    if (cmpYMD(v, endDate) > 0) setEndDate(v)
  }
  const onChangeEnd = (v: string) => {
    setEndDate(cmpYMD(v, startDate) < 0 ? startDate : v)
  }

const submit = async () => {
  // (ไม่บังคับ) client-side validate ให้ UX ดีขึ้น
  if (!startDate || !endDate) {
    setErr('กรุณาเลือกวันเริ่ม/สิ้นสุด')
    return
  }
  if (startDate > endDate) {
    setErr('วันเริ่มต้องไม่เกินวันสิ้นสุด')
    return
  }

  try {
    setSaving(true)
    setErr(null)

    const res = await fetch('/api/OperationalPlan/project/schedule/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        entry: { startDate, endDate, memberIds, note },
      }),
    })

    // พาร์ส JSON ก่อน แล้วเช็คทั้ง HTTP status และ success flag
    const data = await res.json().catch(() => null as any)

    if (!res.ok || !data?.success) {
      throw new Error(data?.error || `HTTP ${res.status}`)
    }

    // server คืน { success, project, scheduleId }
    onSaved(data.project as Project)
    // ถ้าต้องใช้ id ที่เพิ่งสร้าง: data.scheduleId
  } catch (e: any) {
    setErr(e?.message || 'Save failed')
  } finally {
    setSaving(false)
  }
}

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>เพิ่มตารางงาน</h3>

        <div className="form-row">
          <label>
            <span className="small-label">เริ่ม</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onChangeStart(e.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span className="small-label">สิ้นสุด</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onChangeEnd(e.target.value)}
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            <span className="small-label">บุคลากร</span>
            <select
              multiple
              value={memberIds}
              onChange={(e) =>
                setMemberIds(
                  Array.from(e.target.selectedOptions, (o) => o.value)
                )
              }
              style={{ minHeight: 120 }}
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            <span className="small-label">หมายเหตุ</span>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>

        {err && (
          <p className="error" style={{ color: '#c53030' }}>
            {err}
          </p>
        )}

        <div className="modal-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={onClose}
            disabled={saving}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={submit}
            disabled={saving}
          >
            {saving ? 'กำลังบันทึก…' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** =============================
 *  Page Component
 *  ============================= */
type QuickAddState = { projectId: string; date: string } | null

const OperationalPlanPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'project' | 'member'>('project')

  const [members, setMembers] = useState<Member[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quick-add modal state
  const [quickAdd, setQuickAdd] = useState<QuickAddState>(null)
  const openQuickAdd = (projectId: string, dateStr: string) =>
    setQuickAdd({ projectId, date: dateStr })
  const closeQuickAdd = () => setQuickAdd(null)

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
                            onClick={() => openQuickAdd(project._id, dayStr)}
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

  /** ------------ MEMBER VIEW (unchanged) ------------ */
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

      {/* Quick-add modal (only for Project View clicks) */}
      {quickAdd && (
        <ScheduleQuickAddModal
          projectId={quickAdd.projectId}
          initialDate={quickAdd.date}
          members={members}
          onClose={closeQuickAdd}
          onSaved={(updatedProject) => {
            setProjects((prev) =>
              prev.map((p) =>
                p._id === updatedProject._id ? updatedProject : p
              )
            )
            closeQuickAdd()
          }}
        />
      )}
    </div>
  )
}

export default OperationalPlanPage
