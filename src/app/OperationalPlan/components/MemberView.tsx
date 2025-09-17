'use client'

import React, { useLayoutEffect, useRef, useEffect } from 'react'
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

  // ---- refs
  const containerRef = useRef<HTMLDivElement | null>(null)
  const todayHeaderRef = useRef<HTMLTableCellElement | null>(null)
  const didAutoScroll = useRef(false)

  // track if a drag happened to cancel a click that follows immediately
  const movedRef = useRef(false)

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
    let capturedId: number | null = null
    let skipDragForThisPointer = false

    const isInteractive = (t: HTMLElement) =>
      !!t.closest(
        'button, a, [role="button"], .sticky-col, .header-project, .header-date'
      )

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      skipDragForThisPointer = isInteractive(e.target as HTMLElement)
      if (skipDragForThisPointer) return

      dragging.active = true
      movedRef.current = false
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

      if (
        !movedRef.current &&
        (Math.abs(dx) > DRAG_THRESH || Math.abs(dy) > DRAG_THRESH)
      ) {
        movedRef.current = true
        el.classList.add('dragging') // only once you’re actually dragging
      }

      if (movedRef.current) {
        el.scrollLeft = start.left - dx
        el.scrollTop = start.top - dy
        e.preventDefault() // prevent native scrolling/selection ONLY while dragging
      }
    }

    const onPointerUpOrCancel = (_e: PointerEvent) => {
      if (dragging.active) {
        dragging.active = false
        el.classList.remove('dragging')
        try {
          if (capturedId != null) el.releasePointerCapture(capturedId)
        } catch {}
      }
      skipDragForThisPointer = false
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
    if (movedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      movedRef.current = false
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
            <col key={`m-col-${i}`} className="col-day" />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th className="sticky-col header-project">Member</th>
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

                // 1) Skip if no overlap with [monthStartStr, monthEndStr]
                if (
                  cmpYMD(s.endDate, monthStartStr) < 0 || // ends before month starts
                  cmpYMD(s.startDate, monthEndStr) > 0 // starts after month ends
                ) {
                  return
                }
                
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
