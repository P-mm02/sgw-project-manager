// src/app/OperationalPlan/addProject/components/ScheduleEditor.tsx
'use client'

import React from 'react'
import type { Member, ScheduleEntryInput } from '../types'
import DateInputTH from '@/components/DateInputTH'
import MemberMultiSelect from './MemberMultiSelect'

type EditingState = {
  projectId: string | null
  scheduleId: string | null
  form: ScheduleEntryInput
  saving: boolean
}

type Props = {
  members: Member[]
  memberSelectSize: number
  editingSchedule: EditingState
  setEditingSchedule: React.Dispatch<React.SetStateAction<EditingState>>
  onSave: () => Promise<void>
  onCancel: () => void
}

export default function ScheduleEditor({
  members,
  memberSelectSize,
  editingSchedule,
  setEditingSchedule,
  onSave,
  onCancel,
}: Props) {
  const { form, saving } = editingSchedule
  const start = form.startDate || ''
  const end = form.endDate || ''

  const setForm = (patch: Partial<ScheduleEntryInput>) =>
    setEditingSchedule((st) => ({ ...st, form: { ...st.form, ...patch } }))

  const onStartChange = (v: string) =>
    setEditingSchedule((st) => {
      const e = st.form.endDate
      const fixedEnd = e && e < v ? v : e
      return { ...st, form: { ...st.form, startDate: v, endDate: fixedEnd } }
    })

  const onEndChange = (v: string) =>
    setEditingSchedule((st) => {
      const s = st.form.startDate
      const fixedStart = s && v < s ? v : s
      return { ...st, form: { ...st.form, startDate: fixedStart, endDate: v } }
    })

  return (
    <>
      <div className="schedule-grid">
        <div>
          <span className="small-label">เริ่ม</span>
          <div className="date-inline">
            <DateInputTH
              value={start}
              max={end || undefined}
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
              value={end}
              min={start || undefined}
              locale="th"
              buddhistEra
              className="op-input"
              onChange={onEndChange}
            />
          </div>
        </div>

        <div>
          <MemberMultiSelect
            members={members}
            value={form.memberIds}
            onChange={(ids) => setForm({ memberIds: ids })}
          />
        </div>

        <div className="schedule-note">
          <span className="small-label">หมายเหตุ</span>
          <input
            className="op-input"
            value={form.note || ''}
            onChange={(e) => setForm({ note: e.target.value })}
            placeholder="หมายเหตุ"
          />
        </div>
      </div>

      <div className="row-actions">
        <button
          type="button"
          className="btn primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'กำลังบันทึก…' : 'บันทึก'}
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={onCancel}
          disabled={saving}
        >
          ยกเลิก
        </button>
      </div>
    </>
  )
}
