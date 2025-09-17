// src/app/OperationalPlan/components/ProjectView.tsx
'use client'

import React, { useLayoutEffect, useRef, useEffect } from 'react'
import type { Project, ScheduleEntry } from '../types'
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
  onBarClick: (projectId: string, entry: ScheduleEntry) => void
}

export default function ProjectView({
  projects,
  daysInMonth,
  monthStartStr,
  monthEndStr,
  memberMap,
  onDayClick,
  onBarClick,
}: Props) {
  const todayIdx = daysInMonth.findIndex((d) => isToday(d))

  // ---- refs
  const containerRef = useRef<HTMLDivElement | null>(null)
  const todayHeaderRef = useRef<HTMLTableCellElement | null>(null)
  const didAutoScroll = useRef(false)

  // ---- drag state
  const moved = useRef(false)

  // center "today" once
  useLayoutEffect(() => {
    if (didAutoScroll.current) return
    if (todayIdx < 0) return
    const container = containerRef.current
    const todayEl =
      todayHeaderRef.current ||
      (container?.querySelector('th.header-date.today') as HTMLElement | null)
    if (container && todayEl) {
      requestAnimationFrame(() => {
        todayEl.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'center',
        })
        didAutoScroll.current = true
      })
    }
  }, [todayIdx, daysInMonth.length])

  // click-drag pan (X+Y) with threshold
useEffect(() => {
  const el = containerRef.current
  if (!el) return

  const DRAG_THRESH = 3
  const dragging = { active: false }
  const start = { x: 0, y: 0, left: 0, top: 0 }
  let moved = false
  let capturedId: number | null = null
  let skipDragForThisPointer = false

  const isInteractive = (t: HTMLElement) =>
    !!t.closest(
      // anything the user might click/tap
      'button, a, [role="button"], .schedule-bar, .sticky-col, .header-project, .header-date'
    )

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    // If the user pressed down on an interactive element, don't initiate drag at all.
    skipDragForThisPointer = isInteractive(e.target as HTMLElement)
    if (skipDragForThisPointer) return

    dragging.active = true
    moved = false
    start.x = e.clientX
    start.y = e.clientY
    start.left = el.scrollLeft
    start.top = el.scrollTop
    capturedId = e.pointerId
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging.active || skipDragForThisPointer) return

    const dx = e.clientX - start.x
    const dy = e.clientY - start.y

    if (!moved && (Math.abs(dx) > DRAG_THRESH || Math.abs(dy) > DRAG_THRESH)) {
      moved = true
      el.classList.add('dragging') // only once you’re actually dragging
    }

    if (moved) {
      el.scrollLeft = start.left - dx
      el.scrollTop = start.top - dy
      e.preventDefault() // prevent native scrolling/selection ONLY while dragging
    }
  }

  const onPointerUpOrCancel = (e: PointerEvent) => {
    if (dragging.active) {
      dragging.active = false
      el.classList.remove('dragging')
      try {
        if (capturedId != null) el.releasePointerCapture(capturedId)
      } catch {}
    }
    // reset for next pointer sequence
    skipDragForThisPointer = false
    moved = false
  }

  el.addEventListener('pointerdown', onPointerDown)
  el.addEventListener('pointermove', onPointerMove)
  el.addEventListener('pointerup', onPointerUpOrCancel)
  el.addEventListener('pointercancel', onPointerUpOrCancel)

  return () => {
    el.removeEventListener('pointerdown', onPointerDown)
    el.removeEventListener('pointermove', onPointerMove)
    el.removeEventListener('pointerup', onPointerUpOrCancel)
    el.removeEventListener('pointercancel', onPointerUpOrCancel)
  }
}, [])

  // kill one click right after a drag
  const handleClickCapture: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (moved.current) {
      e.preventDefault()
      e.stopPropagation()
      moved.current = false
    }
  }

  return (
    <div
      className="table-container"
      ref={containerRef}
      onClickCapture={handleClickCapture}
    >
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
              const today = isToday(day)
              return (
                <th
                  key={key}
                  className={`header-date ${today ? 'today' : ''}`}
                  ref={today ? todayHeaderRef : undefined}
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
            <tr key={project.id}>
              <td className="sticky-col cell-project">{project.projectName}</td>
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
                  {daysInMonth.map((day, i) => {
                    const dayStr = toLocalDateString(day)
                    return (
                      <button
                        key={`hit-${project.id}-${i}`}
                        className="hit-cell"
                        title={`Add schedule on ${dayStr}`}
                        aria-label={`Add schedule on ${dayStr}`}
                        type="button"
                        onClick={() => onDayClick(project.id, dayStr)}
                        style={{ gridColumn: `${i + 1} / ${i + 2}` }}
                      >
                        +
                      </button>
                    )
                  })}

                  {project.schedule.map((s, idx) => {
                    // 1) Fast reject: no overlap with [monthStartStr, monthEndStr]
                    if (
                      cmpYMD(s.endDate, monthStartStr) < 0 || // ends before month starts
                      cmpYMD(s.startDate, monthEndStr) > 0 // starts after month ends
                    ) {
                      return null
                    }
                    
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
                    if (cmpYMD(start, end) > 0) return null

                    const startIdx = dayIndexFromMonthStart(
                      start,
                      monthStartStr
                    )
                    const endIdx = dayIndexFromMonthStart(end, monthStartStr)
                    const memberNames = s.memberIds.map(
                      (id) => memberMap.get(id) ?? id
                    )
                    const noteText = (s.note || '').trim()
                    const hasAny = memberNames.length > 0 || noteText.length > 0

                    return (
                      <div
                        key={`${project.id}-bar-${(s as any).id ?? idx}`}
                        className="grid-bar schedule-bar"
                        style={{
                          gridColumn: `${startIdx + 1} / ${endIdx + 2}`,
                        }}
                        title={noteText || undefined}
                        role="button"
                        tabIndex={0}
                        onClick={() => onBarClick(project.id, s)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ')
                            onBarClick(project.id, s)
                        }}
                      >
                        {hasAny && (
                          <>
                            {memberNames.length > 0 && (
                              <div className="member-tag text-wrap">
                                {memberNames.join(', ')}
                              </div>
                            )}
                            {noteText && (
                              <div className="note-text text-wrap">
                                {noteText}
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
