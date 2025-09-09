'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './page.css'
import BackButton from '@/components/BackButton'

/** =============================
 *  Types
 *  ============================= */
type Member = {
  id: string
  name: string
  positions: string[]
  active: boolean
}

type ScheduleEntryInput = {
  startDate: string // YYYY-MM-DD (local BKK)
  endDate: string // YYYY-MM-DD (local BKK)
  memberIds: string[]
  note?: string
}

type ScheduleEntry = ScheduleEntryInput & {
  id: string
}

type Project = {
  id: string
  projectName: string
  schedule: ScheduleEntry[]
  createdAt?: string
  updatedAt?: string
}

/** Helpers */
const BKK_TZ = 'Asia/Bangkok'
const toLocalDateString = (date: Date) =>
  date.toLocaleDateString('en-CA', { timeZone: BKK_TZ })

/** Simple validation */
const isValidYMD = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)
const isDateOrderOK = (s: string, e: string) =>
  isValidYMD(s) && isValidYMD(e) && new Date(s) <= new Date(e)

/** =============================
 *  Component
 *  ============================= */
export default function AddProjectPage() {
  /** --- Add form state --- */
  const [projectName, setProjectName] = useState('')
  const [newSchedules, setNewSchedules] = useState<ScheduleEntryInput[]>([
    {
      startDate: toLocalDateString(new Date()),
      endDate: toLocalDateString(new Date()),
      memberIds: [],
      note: '',
    },
  ])

  /** --- Collections & UI state --- */
  const [members, setMembers] = useState<Member[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>('')

  /** --- Search/filter for projects --- */
  const [query, setQuery] = useState('')

  /** --- Inline edit project name --- */
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState('')

  /** --- Expand schedules per project --- */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  /** --- Inline schedule edit/add per project --- */
  const [editingSchedule, setEditingSchedule] = useState<{
    projectId: string | null
    scheduleId: string | null
    form: ScheduleEntryInput
    saving: boolean
  }>({
    projectId: null,
    scheduleId: null,
    form: {
      startDate: toLocalDateString(new Date()),
      endDate: toLocalDateString(new Date()),
      memberIds: [],
      note: '',
    },
    saving: false,
  })

  const [addingScheduleFor, setAddingScheduleFor] = useState<{
    projectId: string | null
    form: ScheduleEntryInput
    saving: boolean
  }>({
    projectId: null,
    form: {
      startDate: toLocalDateString(new Date()),
      endDate: toLocalDateString(new Date()),
      memberIds: [],
      note: '',
    },
    saving: false,
  })

  const resetAlerts = () => {
    setError(null)
    setSuccess('')
  }

  /** Fetch members for selector */
  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/OperationalPlan/member/get', {
        cache: 'no-store',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'โหลดรายชื่อไม่สำเร็จ')
      const list: Member[] = (data.members || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        positions: m.positions || [],
        active: !!m.active,
      }))
      setMembers(list)
    } catch (e: any) {
      setError(e.message || 'โหลดรายชื่อไม่สำเร็จ')
    }
  }

  /** Fetch projects */
  const fetchProjects = async () => {
    try {
      setFetching(true)
      const params = new URLSearchParams()
      if (query.trim()) params.set('search', query.trim())
      const url =
        '/api/OperationalPlan/project/get' +
        (params.toString() ? `?${params.toString()}` : '')
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'โหลดโปรเจ็กต์ไม่สำเร็จ')
      setProjects((data.projects || []) as Project[])
    } catch (e: any) {
      setError(e.message || 'โหลดโปรเจ็กต์ไม่สำเร็จ')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchMembers()
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(fetchProjects, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  /** --- Add Form handlers --- */
  const addScheduleRow = () => {
    setNewSchedules((rows) => [
      ...rows,
      {
        startDate: toLocalDateString(new Date()),
        endDate: toLocalDateString(new Date()),
        memberIds: [],
        note: '',
      },
    ])
  }

  const removeScheduleRow = (idx: number) => {
    setNewSchedules((rows) => rows.filter((_, i) => i !== idx))
  }

  const updateScheduleRow = (
    idx: number,
    patch: Partial<ScheduleEntryInput>
  ) => {
    setNewSchedules((rows) =>
      rows.map((r, i) => (i === idx ? { ...r, ...patch } : r))
    )
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    resetAlerts()
    if (!projectName.trim()) {
      setError('กรุณากรอกชื่อโปรเจ็กต์')
      return
    }
    // basic validation on schedules (optional)
    for (const [i, s] of newSchedules.entries()) {
      if (!isValidYMD(s.startDate) || !isValidYMD(s.endDate)) {
        setError(`ตารางงานแถวที่ ${i + 1}: รูปแบบวันที่ไม่ถูกต้อง`)
        return
      }
      if (!isDateOrderOK(s.startDate, s.endDate)) {
        setError(`ตารางงานแถวที่ ${i + 1}: วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด`)
        return
      }
    }

    try {
      setLoadingAdd(true)
      const res = await fetch('/api/OperationalPlan/project/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectName.trim(),
          schedule: newSchedules,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'เพิ่มโปรเจ็กต์ไม่สำเร็จ')
      setSuccess(
        `เพิ่มโปรเจ็กต์: ${data.project?.projectName || projectName} สำเร็จ`
      )
      setProjectName('')
      setNewSchedules([
        {
          startDate: toLocalDateString(new Date()),
          endDate: toLocalDateString(new Date()),
          memberIds: [],
          note: '',
        },
      ])
      fetchProjects()
    } catch (e: any) {
      setError(e.message || 'เพิ่มโปรเจ็กต์ไม่สำเร็จ')
    } finally {
      setLoadingAdd(false)
    }
  }

  /** --- Project name edit --- */
  const startEditProject = (p: Project) => {
    setEditingProjectId(p.id)
    setEditProjectName(p.projectName)
    resetAlerts()
  }
  const cancelEditProject = () => {
    setEditingProjectId(null)
    setEditProjectName('')
  }
  const saveEditProject = async () => {
    if (!editingProjectId) return
    if (!editProjectName.trim()) {
      setError('กรุณากรอกชื่อโปรเจ็กต์')
      return
    }
    try {
      const res = await fetch('/api/OperationalPlan/project/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProjectId,
          projectName: editProjectName.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'อัปเดตโปรเจ็กต์ไม่สำเร็จ')
      setSuccess('อัปเดตโปรเจ็กต์สำเร็จ')
      setEditingProjectId(null)
      fetchProjects()
    } catch (e: any) {
      setError(e.message || 'อัปเดตโปรเจ็กต์ไม่สำเร็จ')
    }
  }

  /** --- Project delete --- */
  const deleteProject = async (p: Project) => {
    resetAlerts()
    const ok = confirm(`ลบโปรเจ็กต์ "${p.projectName}" ?`)
    if (!ok) return
    try {
      const res = await fetch(`/api/OperationalPlan/project/delete/${p.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'ลบไม่สำเร็จ')
      setSuccess(`ลบโปรเจ็กต์: ${p.projectName} สำเร็จ`)
      fetchProjects()
    } catch (e: any) {
      setError(e.message || 'ลบไม่สำเร็จ')
    }
  }

  /** --- Schedule expand toggle --- */
  const toggleExpand = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }))
  }

  /** --- Schedule editing --- */
  const startEditSchedule = (p: Project, s: ScheduleEntry) => {
    setEditingSchedule({
      projectId: p.id,
      scheduleId: s.id,
      form: {
        startDate: s.startDate,
        endDate: s.endDate,
        memberIds: [...s.memberIds],
        note: s.note || '',
      },
      saving: false,
    })
    resetAlerts()
  }
  const cancelEditSchedule = () =>
    setEditingSchedule((state) => ({
      ...state,
      projectId: null,
      scheduleId: null,
    }))

  const saveEditSchedule = async () => {
    const { projectId, scheduleId, form } = editingSchedule
    if (!projectId || !scheduleId) return
    if (!isValidYMD(form.startDate) || !isValidYMD(form.endDate)) {
      setError('รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)')
      return
    }
    if (!isDateOrderOK(form.startDate, form.endDate)) {
      setError('วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด')
      return
    }
    try {
      setEditingSchedule((s) => ({ ...s, saving: true }))
      const res = await fetch('/api/OperationalPlan/project/schedule/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          scheduleId,
          patch: form, // conforms to model static updateScheduleEntryById
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'อัปเดตตารางงานไม่สำเร็จ')
      setSuccess('อัปเดตตารางงานสำเร็จ')
      setEditingSchedule({
        projectId: null,
        scheduleId: null,
        form: {
          startDate: toLocalDateString(new Date()),
          endDate: toLocalDateString(new Date()),
          memberIds: [],
          note: '',
        },
        saving: false,
      })
      fetchProjects()
    } catch (e: any) {
      setError(e.message || 'อัปเดตตารางงานไม่สำเร็จ')
      setEditingSchedule((s) => ({ ...s, saving: false }))
    }
  }

  /** --- Schedule delete --- */
  const deleteSchedule = async (p: Project, s: ScheduleEntry) => {
    resetAlerts()
    const ok = confirm(
      `ลบตารางงาน ${s.startDate} → ${s.endDate} ในโปรเจ็กต์ "${p.projectName}" ?`
    )
    if (!ok) return
    try {
      const res = await fetch(
        `/api/OperationalPlan/project/schedule/delete?projectId=${p.id}&scheduleId=${s.id}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'ลบตารางงานไม่สำเร็จ')
      setSuccess('ลบตารางงานสำเร็จ')
      fetchProjects()
    } catch (e: any) {
      setError(e.message || 'ลบตารางงานไม่สำเร็จ')
    }
  }

  /** --- Schedule add to existing project --- */
  const startAddScheduleFor = (p: Project) => {
    setAddingScheduleFor({
      projectId: p.id,
      form: {
        startDate: toLocalDateString(new Date()),
        endDate: toLocalDateString(new Date()),
        memberIds: [],
        note: '',
      },
      saving: false,
    })
    resetAlerts()
  }
  const cancelAddScheduleFor = () =>
    setAddingScheduleFor({
      projectId: null,
      form: addingScheduleFor.form,
      saving: false,
    })

  const saveAddScheduleFor = async () => {
    const { projectId, form } = addingScheduleFor
    if (!projectId) return
    if (!isValidYMD(form.startDate) || !isValidYMD(form.endDate)) {
      setError('รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)')
      return
    }
    if (!isDateOrderOK(form.startDate, form.endDate)) {
      setError('วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด')
      return
    }
    try {
      setAddingScheduleFor((s) => ({ ...s, saving: true }))
      const res = await fetch('/api/OperationalPlan/project/schedule/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, entry: form }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'เพิ่มตารางงานไม่สำเร็จ')
      setSuccess('เพิ่มตารางงานสำเร็จ')
      setAddingScheduleFor({
        projectId: null,
        form: {
          startDate: toLocalDateString(new Date()),
          endDate: toLocalDateString(new Date()),
          memberIds: [],
          note: '',
        },
        saving: false,
      })
      fetchProjects()
    } catch (e: any) {
      setError(e.message || 'เพิ่มตารางงานไม่สำเร็จ')
      setAddingScheduleFor((s) => ({ ...s, saving: false }))
    }
  }

  /** Derived visible projects */
  const visibleProjects = useMemo(() => projects, [projects])

  /** Render helpers */
  const memberName = (id: string) =>
    members.find((m) => m.id === id)?.name || '—'

  return (
    <div className="op-container">
      <BackButton />
      <h1 className="op-title">โปรเจ็กต์ (Operational Plan)</h1>

      {(error || success) && (
        <div className="op-alerts">
          {error && <div className="op-alert error">{error}</div>}
          {success && <div className="op-alert success">{success}</div>}
        </div>
      )}

      {/* Add Project form */}
      <form className="op-card op-form" onSubmit={handleAddProject}>
        <div className="op-form-row">
          <label htmlFor="projectName">ชื่อโปรเจ็กต์</label>
          <input
            id="projectName"
            className="op-input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="เช่น โครงการสำรวจธรณี กทม."
            maxLength={120}
            required
          />
        </div>

        <div className="op-form-row">
          <label>ตารางงานเริ่มต้น (เพิ่มได้หลายช่วง)</label>

          {newSchedules.map((s, idx) => (
            <div key={idx} className="schedule-row">
              <div className="schedule-grid">
                <div>
                  <span className="small-label">เริ่ม</span>
                  <input
                    type="date"
                    className="op-input"
                    value={s.startDate}
                    onChange={(e) =>
                      updateScheduleRow(idx, { startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <span className="small-label">สิ้นสุด</span>
                  <input
                    type="date"
                    className="op-input"
                    value={s.endDate}
                    onChange={(e) =>
                      updateScheduleRow(idx, { endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <span className="small-label">บุคลากร</span>
                  <select
                    className="op-input"
                    multiple
                    value={s.memberIds}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions).map(
                        (o) => o.value
                      )
                      updateScheduleRow(idx, { memberIds: values })
                    }}
                    size={Math.min(6, Math.max(3, members.length))}
                    title="กด Ctrl/⌘ เพื่อเลือกหลายคน"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.active ? '' : '(Inactive)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="schedule-note">
                  <span className="small-label">หมายเหตุ</span>
                  <input
                    className="op-input"
                    value={s.note || ''}
                    onChange={(e) =>
                      updateScheduleRow(idx, { note: e.target.value })
                    }
                    placeholder="ตัวอย่าง: คืนเครื่องจักรวันที่ X"
                  />
                </div>
              </div>

              <div className="row-actions">
                <button
                  type="button"
                  className="btn danger"
                  onClick={() => removeScheduleRow(idx)}
                  disabled={newSchedules.length <= 1}
                >
                  ลบช่วงนี้
                </button>
              </div>
            </div>
          ))}

          <div className="op-actions">
            <button type="button" className="btn" onClick={addScheduleRow}>
              + เพิ่มช่วงตารางงาน
            </button>
          </div>
        </div>

        <div className="op-actions">
          <button className="btn primary" type="submit" disabled={loadingAdd}>
            {loadingAdd ? 'กำลังบันทึก…' : 'เพิ่มโปรเจ็กต์'}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setProjectName('')
              setNewSchedules([
                {
                  startDate: toLocalDateString(new Date()),
                  endDate: toLocalDateString(new Date()),
                  memberIds: [],
                  note: '',
                },
              ])
              resetAlerts()
            }}
            disabled={loadingAdd}
          >
            ล้างฟอร์ม
          </button>
        </div>
      </form>

      {/* Toolbar */}
      <div className="op-toolbar">
        <input
          className="op-input"
          placeholder="ค้นหาชื่อโปรเจ็กต์…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn"
          onClick={() => fetchProjects()}
          disabled={fetching}
        >
          {fetching ? 'กำลังโหลด…' : 'รีเฟรช'}
        </button>
      </div>

      {/* Projects list */}
      <div className="op-card-grid">
        {visibleProjects.length === 0 && (
          <div className="muted center">
            {fetching ? 'กำลังโหลด…' : 'ไม่มีข้อมูล'}
          </div>
        )}

        {visibleProjects.map((p) => {
          const isEditing = editingProjectId === p.id
          const isExpanded = !!expanded[p.id]

          return (
            <div key={p.id} className="project-card">
              {!isEditing ? (
                <>
                  <div className="member-header">
                    <h3 className="member-name">{p.projectName}</h3>
                    <div className="project-badges">
                      <span className="badge">
                        {p.schedule?.length || 0} ช่วง
                      </span>
                    </div>
                  </div>

                  <div className="row-actions">
                    <button className="btn" onClick={() => toggleExpand(p.id)}>
                      {isExpanded ? 'ซ่อนตารางงาน' : 'แสดงตารางงาน'}
                    </button>
                    <button className="btn" onClick={() => startEditProject(p)}>
                      แก้ชื่อ
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => deleteProject(p)}
                    >
                      ลบโปรเจ็กต์
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="schedule-list">
                      {(!p.schedule || p.schedule.length === 0) && (
                        <div className="muted">ไม่มีตารางงาน</div>
                      )}

                      {p.schedule?.map((s) => {
                        const editingThis =
                          editingSchedule.projectId === p.id &&
                          editingSchedule.scheduleId === s.id

                        return (
                          <div key={s.id} className="schedule-item">
                            {!editingThis ? (
                              <>
                                <div className="schedule-line">
                                  <div className="dates">
                                    <span className="date-chip">
                                      {s.startDate}
                                    </span>
                                    <span>→</span>
                                    <span className="date-chip">
                                      {s.endDate}
                                    </span>
                                  </div>
                                  <div className="chips">
                                    {s.memberIds.length > 0 ? (
                                      s.memberIds.map((mid) => (
                                        <span key={mid} className="chip">
                                          {memberName(mid)}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="muted small">
                                        ไม่มีบุคลากร
                                      </span>
                                    )}
                                  </div>
                                  {s.note && (
                                    <div className="note">📝 {s.note}</div>
                                  )}
                                </div>

                                <div className="row-actions">
                                  <button
                                    className="btn"
                                    onClick={() => startEditSchedule(p, s)}
                                  >
                                    แก้ไขช่วงนี้
                                  </button>
                                  <button
                                    className="btn danger"
                                    onClick={() => deleteSchedule(p, s)}
                                  >
                                    ลบช่วงนี้
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="schedule-grid">
                                  <div>
                                    <span className="small-label">เริ่ม</span>
                                    <input
                                      type="date"
                                      className="op-input"
                                      value={editingSchedule.form.startDate}
                                      onChange={(e) =>
                                        setEditingSchedule((st) => ({
                                          ...st,
                                          form: {
                                            ...st.form,
                                            startDate: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                  </div>
                                  <div>
                                    <span className="small-label">สิ้นสุด</span>
                                    <input
                                      type="date"
                                      className="op-input"
                                      value={editingSchedule.form.endDate}
                                      onChange={(e) =>
                                        setEditingSchedule((st) => ({
                                          ...st,
                                          form: {
                                            ...st.form,
                                            endDate: e.target.value,
                                          },
                                        }))
                                      }
                                    />
                                  </div>
                                  <div>
                                    <span className="small-label">บุคลากร</span>
                                    <select
                                      className="op-input"
                                      multiple
                                      value={editingSchedule.form.memberIds}
                                      onChange={(e) => {
                                        const values = Array.from(
                                          e.target.selectedOptions
                                        ).map((o) => o.value)
                                        setEditingSchedule((st) => ({
                                          ...st,
                                          form: {
                                            ...st.form,
                                            memberIds: values,
                                          },
                                        }))
                                      }}
                                      size={Math.min(
                                        6,
                                        Math.max(3, members.length)
                                      )}
                                      title="กด Ctrl/⌘ เพื่อเลือกหลายคน"
                                    >
                                      {members.map((m) => (
                                        <option key={m.id} value={m.id}>
                                          {m.name}{' '}
                                          {m.active ? '' : '(Inactive)'}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="schedule-note">
                                    <span className="small-label">
                                      หมายเหตุ
                                    </span>
                                    <input
                                      className="op-input"
                                      value={editingSchedule.form.note || ''}
                                      onChange={(e) =>
                                        setEditingSchedule((st) => ({
                                          ...st,
                                          form: {
                                            ...st.form,
                                            note: e.target.value,
                                          },
                                        }))
                                      }
                                      placeholder="หมายเหตุ"
                                    />
                                  </div>
                                </div>

                                <div className="row-actions">
                                  <button
                                    className="btn primary"
                                    onClick={saveEditSchedule}
                                    disabled={editingSchedule.saving}
                                  >
                                    {editingSchedule.saving
                                      ? 'กำลังบันทึก…'
                                      : 'บันทึก'}
                                  </button>
                                  <button
                                    className="btn ghost"
                                    onClick={cancelEditSchedule}
                                    disabled={editingSchedule.saving}
                                  >
                                    ยกเลิก
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}

                      {/* Add schedule to existing project */}
                      {addingScheduleFor.projectId !== p.id ? (
                        <div className="op-actions">
                          <button
                            className="btn"
                            onClick={() => startAddScheduleFor(p)}
                          >
                            + เพิ่มช่วงตารางงานให้โปรเจ็กต์นี้
                          </button>
                        </div>
                      ) : (
                        <div className="op-card lite">
                          <div className="schedule-grid">
                            <div>
                              <span className="small-label">เริ่ม</span>
                              <input
                                type="date"
                                className="op-input"
                                value={addingScheduleFor.form.startDate}
                                onChange={(e) =>
                                  setAddingScheduleFor((st) => ({
                                    ...st,
                                    form: {
                                      ...st.form,
                                      startDate: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <span className="small-label">สิ้นสุด</span>
                              <input
                                type="date"
                                className="op-input"
                                value={addingScheduleFor.form.endDate}
                                onChange={(e) =>
                                  setAddingScheduleFor((st) => ({
                                    ...st,
                                    form: {
                                      ...st.form,
                                      endDate: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                            <div>
                              <span className="small-label">บุคลากร</span>
                              <select
                                className="op-input"
                                multiple
                                value={addingScheduleFor.form.memberIds}
                                onChange={(e) => {
                                  const values = Array.from(
                                    e.target.selectedOptions
                                  ).map((o) => o.value)
                                  setAddingScheduleFor((st) => ({
                                    ...st,
                                    form: { ...st.form, memberIds: values },
                                  }))
                                }}
                                size={Math.min(6, Math.max(3, members.length))}
                              >
                                {members.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} {m.active ? '' : '(Inactive)'}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="schedule-note">
                              <span className="small-label">หมายเหตุ</span>
                              <input
                                className="op-input"
                                value={addingScheduleFor.form.note || ''}
                                onChange={(e) =>
                                  setAddingScheduleFor((st) => ({
                                    ...st,
                                    form: { ...st.form, note: e.target.value },
                                  }))
                                }
                                placeholder="หมายเหตุ"
                              />
                            </div>
                          </div>

                          <div className="row-actions">
                            <button
                              className="btn primary"
                              onClick={saveAddScheduleFor}
                              disabled={addingScheduleFor.saving}
                            >
                              {addingScheduleFor.saving
                                ? 'กำลังบันทึก…'
                                : 'บันทึกช่วง'}
                            </button>
                            <button
                              className="btn ghost"
                              onClick={cancelAddScheduleFor}
                              disabled={addingScheduleFor.saving}
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="member-header">
                    <input
                      className="op-input"
                      value={editProjectName}
                      onChange={(e) => setEditProjectName(e.target.value)}
                    />
                  </div>
                  <div className="row-actions">
                    <button className="btn primary" onClick={saveEditProject}>
                      บันทึก
                    </button>
                    <button className="btn ghost" onClick={cancelEditProject}>
                      ยกเลิก
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
