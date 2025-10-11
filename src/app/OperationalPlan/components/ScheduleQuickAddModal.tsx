// src/app/OperationalPlan/components/ScheduleQuickAddModal.tsx
'use client'

import React, { useEffect, useState } from 'react'
import type { Member , Project } from '../addProject/types'
import { cmpYMD } from '../utils/date'
import DateInputTH from '@/components/DateInputTH'
import '../addProject/page.css' // for .modal-backdrop, .modal-card, .btn, .op-input, etc.

// ✅ keep using the shared multi-select from addProject
import MemberMultiSelect from '../addProject/components/MemberMultiSelect'

type Props = {
  projectId: string
  initialDate: string
  members: Member[]
  onClose: () => void
  onSaved: (p: Project) => void
}

export default function ScheduleQuickAddModal({
  projectId,
  initialDate,
  members,
  onClose,
  onSaved,
}: Props) {
  const [startDate, setStartDate] = useState(initialDate || '')
  const [endDate, setEndDate] = useState(initialDate || '')
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Keep initial date autofill in sync if prop changes
  useEffect(() => {
    const d = initialDate || ''
    setStartDate(d)
    setEndDate(d)
  }, [initialDate])

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // === Date auto-fill (same rules as ScheduleAdder) ===
  const onChangeStart = (v: string) => {
    setStartDate(v)
    if (endDate && cmpYMD(v, endDate) > 0) setEndDate(v) // if start > end, pull end up
  }
  const onChangeEnd = (v: string) => {
    setEndDate(cmpYMD(v, startDate) < 0 ? startDate : v) // if end < start, clamp to start
  }

  const submit = async () => {
    if (!startDate || !endDate) {
      setErr('กรุณาเลือกวันเริ่ม/สิ้นสุด')
      return
    }
    if (cmpYMD(startDate, endDate) > 0) {
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
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sqam-title"
      onClick={onClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 id="sqam-title">เพิ่มตารางงาน</h3>

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
                onChange={onChangeStart}
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
                onChange={onChangeEnd}
              />
            </div>
          </div>

          {/* ✅ MemberMultiSelect from addProject */}
          <div className="modal-schedule-member">
            <MemberMultiSelect
              members={members}
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
            className="btn primary"
            onClick={submit}
            disabled={saving}
          >
            {saving ? 'กำลังบันทึก…' : 'บันทึกช่วง'}
          </button>
        </div>
      </div>
    </div>
  )
}
