// src/app/OperationalPlan/components/ScheduleEditModal.tsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { Member as OPMember, Project, ScheduleEntry } from '../types'
import DateInputTH from '@/components/DateInputTH'
import MemberMultiSelect from '../addProject/components/MemberMultiSelect'
import type { Member as APMember } from '../addProject/types'

type Props = {
  projectId: string
  schedule: ScheduleEntry
  members: OPMember[]
  onClose: () => void
  onSaved: (p: Project) => void
  onDeleted: (projectId: string, scheduleId: string) => void
}

const isObjectId = (s: string) => /^[a-f\d]{24}$/i.test(s)

export default function ScheduleEditModal({
  projectId,
  schedule,
  members,
  onClose,
  onSaved,
  onDeleted,
}: Props) {
  const [startDate, setStartDate] = useState(schedule.startDate)
  const [endDate, setEndDate] = useState(schedule.endDate)
  const [memberIds, setMemberIds] = useState<string[]>(schedule.memberIds || [])
  const [note, setNote] = useState(schedule.note || '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // adapt members for the shared selector
  const membersForSelect = useMemo<APMember[]>(
    () =>
      members.map((m) => ({
        id: (m as any)._id ?? (m as any).id,
        name: m.name,
        positions: [],
        active: true,
      })),
    [members]
  )

  // date auto-fix rules (same as ScheduleAdder)
  const onStartChange = (v: string) => {
    setStartDate(v)
    if (endDate && endDate < v) setEndDate(v)
  }
  const onEndChange = (v: string) => {
    if (startDate && v < startDate) setStartDate(v)
    setEndDate(v)
  }

  const submit = async () => {
    if (!isObjectId(projectId)) {
      setErr('projectId ไม่ใช่ Mongo ObjectId ที่ถูกต้อง')
      return
    }
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
      // ✅ OLD API expects PUT here
      const res = await fetch('/api/OperationalPlan/project/schedule/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          scheduleId: schedule.id,
          patch: { startDate, endDate, memberIds, note },
        }),
      })
      const data = await res.json().catch(() => null as any)
      if (!res.ok || !data?.success)
        throw new Error(data?.error || `HTTP ${res.status}`)
      onSaved(data.project as Project)
    } catch (e: any) {
      setErr(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm('ลบช่วงงานนี้ใช่ไหม?')) return
    try {
      setSaving(true)
      setErr(null)
      // ✅ OLD API expects scheduleId in the PATH and projectId as a QUERY param
      const url = `/api/OperationalPlan/project/schedule/delete/${encodeURIComponent(
        schedule.id
      )}?projectId=${encodeURIComponent(projectId)}`

      const res = await fetch(url, {
        method: 'DELETE',
      })
      const data = await res.json().catch(() => null as any)
      if (!res.ok || !data?.success)
        throw new Error(data?.error || `HTTP ${res.status}`)

      onSaved(data.project as Project) // backend returns updated project
      onDeleted(projectId, schedule.id)
    } catch (e: any) {
      setErr(e?.message || 'Delete failed')
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
        <h3>แก้ไขช่วงงาน</h3>

        <div className="schedule-grid">
          <div>
            <span className="small-label">เริ่ม</span>
            <div className="date-inline">
              <DateInputTH
                value={startDate}
                max={endDate || undefined}
                locale="th"
                buddhistEra
                className="op-input"
                onChange={onStartChange}
              />
            </div>
          </div>

          <div>
            <span className="small-label">สิ้นสุด</span>
            <div className="date-inline">
              <DateInputTH
                value={endDate}
                min={startDate || undefined}
                locale="th"
                buddhistEra
                className="op-input"
                onChange={onEndChange}
              />
            </div>
          </div>

          <div>
            <MemberMultiSelect
              members={membersForSelect}
              value={memberIds}
              onChange={setMemberIds}
            />
          </div>

          <div className="schedule-note">
            <span className="small-label">หมายเหตุ</span>
            <input
              className="op-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="หมายเหตุ"
              disabled={saving}
            />
          </div>
        </div>

        {err && (
          <p className="error" style={{ color: '#c53030', marginTop: 8 }}>
            {err}
          </p>
        )}

        <div
          className="modal-actions"
          style={{ display: 'flex', gap: 8, marginTop: 12 }}
        >
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
            className="btn danger"
            onClick={remove}
            disabled={saving}
          >
            ลบ
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
