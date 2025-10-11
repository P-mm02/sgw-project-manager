// src/app/OperationalPlan/addProject/page.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import './page.css'
import BackButton from '@/components/BackButton'
import AddProject from './AddProject'
import ProjectsList from './ProjectsList'
import Alerts from './components/Alerts'
import Toolbar from './components/Toolbar'
import { toLocalDateString, isValidYMD, isDateOrderOK } from './helpers'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import {
  getMembers,
  getProjects,
  editProjectName as apiEditProjectName,
  deleteProjectById,
  editSchedule as apiEditSchedule,
  addSchedule as apiAddSchedule,
  deleteScheduleById,
} from './api'
import type {
  Member,
  Project,
  ScheduleEntry,
  ScheduleEntryInput,
} from './types'

import CircleSpining from '@/loading/CircleSpining/CircleSpining'

/** =============================
 *  Page Component
 *  ============================= */
export default function AddProjectPage() {
  /** --- Collections & UI state --- */
  const [members, setMembers] = useState<Member[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [fetching, setFetching] = useState(true)

  /** --- Alerts --- */
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>('')

  /** --- Search / debounce --- */
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 300)

  /** --- Inline edit project name --- */
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState('')

  /** --- Expand schedules per project --- */
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  /** --- Inline schedule edit --- */
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

  /** --- Add schedule for existing project --- */
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

  /** --- Member map for O(1) lookup --- */
  const memberMap = useMemo(() => {
    const m = new Map<string, string>()
    members.forEach((x) => m.set(x._id, x.name))
    return m
  }, [members])
  const memberName = (id: string) => memberMap.get(id) ?? '—'

  const resetAlerts = () => {
    setError(null)
    setSuccess('')
  }

  /** --- Fetch members --- */
  const fetchMembers = async () => {
    try {
      const list = await getMembers()
      setMembers(list)
    } catch (e: any) {
      setError(e.message || 'โหลดรายชื่อไม่สำเร็จ')
    }
  }

  /** --- Fetch projects --- */
  const fetchProjects = async (search = '') => {
    try {
      setFetching(true)
      const list = await getProjects(search)
      setProjects(list)
    } catch (e: any) {
      setError(e.message || 'โหลดโปรเจ็กต์ไม่สำเร็จ')
    } finally {
      setFetching(false)
    }
  }

  /** --- Boot --- */
  useEffect(() => {
    fetchMembers()
    fetchProjects()
  }, [])

  /** --- Debounced search --- */
  useEffect(() => {
    fetchProjects(debouncedQuery)
  }, [debouncedQuery])

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
      await apiEditProjectName(editingProjectId, editProjectName.trim())
      setSuccess('อัปเดตโปรเจ็กต์สำเร็จ')
      setEditingProjectId(null)
      fetchProjects(query)
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
      await deleteProjectById(p.id)
      setSuccess(`ลบโปรเจ็กต์: ${p.projectName} สำเร็จ`)
      fetchProjects(query)
    } catch (e: any) {
      setError(e.message || 'ลบไม่สำเร็จ')
    }
  }

  /** --- Expand/toggle --- */
  const toggleExpand = (id: string) => {
    setExpanded((s) => ({ ...s, [id]: !s[id] }))
  }

  /** --- Schedule edit --- */
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
      await apiEditSchedule(projectId, scheduleId, form)
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
      fetchProjects(query)
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
      await deleteScheduleById(p.id, s.id)
      setSuccess('ลบตารางงานสำเร็จ')
      fetchProjects(query)
    } catch (e: any) {
      setError(e.message || 'ลบตารางงานไม่สำเร็จ')
    }
  }

  /** --- Add schedule to existing project --- */
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
    setAddingScheduleFor((st) => ({
      projectId: null,
      form: st.form,
      saving: false,
    }))

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
      await apiAddSchedule(projectId, form)
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
      fetchProjects(query)
    } catch (e: any) {
      setError(e.message || 'เพิ่มตารางงานไม่สำเร็จ')
      setAddingScheduleFor((s) => ({ ...s, saving: false }))
    }
  }

  /** --- Auto-clear success after 2.5s (QoL) --- */
  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => setSuccess(''), 2500)
    return () => clearTimeout(t)
  }, [success])

  return (
    <div className="op-container">
      <BackButton />
      <h1 className="op-title">จัดการโครงการ</h1>

      <Alerts error={error} success={success} />

      {/* Add Project form */}
      <AddProject
        members={members} // <-- add this
        onSuccess={() => fetchProjects(query)}
        setError={setError}
        setSuccess={setSuccess}
      />

      {/* Toolbar */}
      <Toolbar
        query={query}
        setQuery={setQuery}
        fetching={fetching}
        onRefresh={() => fetchProjects(query)}
      />

      {/* Projects list */}
      {fetching ? (
        <div className="fetching-CircleSpining">
          <CircleSpining />
        </div>
      ) : (
        <ProjectsList
          projects={projects}
          members={members}
          memberName={memberName}
          expanded={expanded}
          toggleExpand={toggleExpand}
          // project name edit
          editingProjectId={editingProjectId}
          editProjectName={editProjectName}
          startEditProject={startEditProject}
          cancelEditProject={cancelEditProject}
          setEditProjectName={setEditProjectName}
          saveEditProject={saveEditProject}
          deleteProject={deleteProject}
          // schedule edit
          editingSchedule={editingSchedule}
          startEditSchedule={startEditSchedule}
          cancelEditSchedule={cancelEditSchedule}
          setEditingSchedule={setEditingSchedule}
          saveEditSchedule={saveEditSchedule}
          deleteSchedule={deleteSchedule}
          // add schedule
          addingScheduleFor={addingScheduleFor}
          startAddScheduleFor={startAddScheduleFor}
          cancelAddScheduleFor={cancelAddScheduleFor}
          setAddingScheduleFor={setAddingScheduleFor}
          saveAddScheduleFor={saveAddScheduleFor}
        />
      )}
    </div>
  )
}
