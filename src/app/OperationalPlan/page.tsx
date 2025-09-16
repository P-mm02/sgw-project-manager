'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './page.css'
import Link from 'next/link'

import type { Member, Project, ScheduleEntry } from './types'
import { BKK_TZ, buildDaysInMonth, toLocalDateString } from './utils/date'

import ProjectView from './components/ProjectView'
import MemberView from './components/MemberView'
import ScheduleQuickAddModal from './components/ScheduleQuickAddModal'
import ScheduleEditModal from './components/ScheduleEditModal'

type QuickAddState = { projectId: string; date: string } | null
type EditState = { projectId: string; schedule: ScheduleEntry } | null

export default function OperationalPlanPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'project' | 'member'>('project')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [members, setMembers] = useState<Member[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quick-add modal state
  const [quickAdd, setQuickAdd] = useState<QuickAddState>(null)
  const openQuickAdd = (projectId: string, dateStr: string) =>
    setQuickAdd({ projectId, date: dateStr })
  const closeQuickAdd = () => setQuickAdd(null)

  // Edit modal state
  const [editModal, setEditModal] = useState<EditState>(null)
  const openEdit = (projectId: string, entry: ScheduleEntry) =>
    setEditModal({ projectId, schedule: entry })
  const closeEdit = () => setEditModal(null)

  // Fetch members + projects
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

  // lock body scroll while fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isFullscreen])
  const toggleFullscreen = () => setIsFullscreen((v) => !v)

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
          <button
            className={`full-screen-plan-btn ${isFullscreen ? 'fixed' : ''}`}
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'ดูเต็มจอ'}
          >
            {isFullscreen ? (
              <div className="full-screen-btn-inner">
                <strong className="full-screen-icon">⛶</strong> ออก
              </div>
            ) : (
              <div className="full-screen-btn-inner">
                <strong className="full-screen-icon">⛶</strong> ดูเต็มหน้าจอ
              </div>
            )}
          </button>
        </div>
      </header>

      <main className={`main-view ${isFullscreen ? 'fullscreen' : ''}`}>
        {view === 'project' ? (
          <ProjectView
            projects={projects}
            daysInMonth={daysInMonth}
            monthStartStr={monthStartStr}
            monthEndStr={monthEndStr}
            memberMap={memberMap}
            onDayClick={openQuickAdd}
            onBarClick={openEdit}
          />
        ) : (
          <MemberView
            members={members}
            projects={projects}
            daysInMonth={daysInMonth}
            monthStartStr={monthStartStr}
            monthEndStr={monthEndStr}
          />
        )}
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
              prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
            )
            closeQuickAdd()
          }}
        />
      )}

      {/* Edit modal (only for Project View schedule bar clicks) */}
      {editModal && ( // ✅
        <ScheduleEditModal
          projectId={editModal.projectId}
          schedule={editModal.schedule}
          members={members}
          onClose={closeEdit}
          onSaved={(updatedProject) => {
            setProjects((prev) =>
              prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
            )
            closeEdit()
          }}
          onDeleted={() => {
            // you can also just rely on onSaved(updatedProject) from backend response
            closeEdit()
          }}
        />
      )}
    </div>
  )
}
