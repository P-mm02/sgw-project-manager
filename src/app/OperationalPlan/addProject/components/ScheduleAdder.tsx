// src/app/OperationalPlan/addProject/components/ScheduleAdder.tsx
'use client'

import React, { useMemo } from 'react'
import type { Member, ScheduleEntryInput } from '../types'
import DateInputTH from '@/components/DateInputTH'

type AddingState = {
  projectId: string | null
  form: ScheduleEntryInput
  saving: boolean
}

type Props = {
  members: Member[]
  memberSelectSize: number // kept for API compatibility; not used anymore
  addingScheduleFor: AddingState
  setAddingScheduleFor: React.Dispatch<React.SetStateAction<AddingState>>
  onSave: () => Promise<void>
  onCancel: () => void
}

export default function ScheduleAdder({
  members,
  // memberSelectSize, // no longer needed with chips
  addingScheduleFor,
  setAddingScheduleFor,
  onSave,
  onCancel,
}: Props) {
  const { form, saving } = addingScheduleFor
  const start = form.startDate || ''
  const end = form.endDate || ''
  const selected = form.memberIds

  const setForm = (patch: Partial<ScheduleEntryInput>) =>
    setAddingScheduleFor((st) => ({ ...st, form: { ...st.form, ...patch } }))

  const onStartChange = (v: string) =>
    setAddingScheduleFor((st) => {
      const e = st.form.endDate
      const fixedEnd = e && e < v ? v : e
      return { ...st, form: { ...st.form, startDate: v, endDate: fixedEnd } }
    })

  const onEndChange = (v: string) =>
    setAddingScheduleFor((st) => {
      const s = st.form.startDate
      const fixedStart = s && v < s ? v : s
      return { ...st, form: { ...st.form, startDate: fixedStart, endDate: v } }
    })

  const activeMembersFirst = useMemo(
    () => [...members].sort((a, b) => Number(b.active) - Number(a.active)),
    [members]
  )

  const toggleMember = (id: string) => {
    setAddingScheduleFor((st) => {
      const exists = st.form.memberIds.includes(id)
      return {
        ...st,
        form: {
          ...st.form,
          memberIds: exists
            ? st.form.memberIds.filter((x) => x !== id)
            : [...st.form.memberIds, id],
        },
      }
    })
  }

  const clearMembers = () => setForm({ memberIds: [] })

  return (
    <div className="op-card lite">
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

        {/* Chips multi-select */}
        <div>
          <div
            className="small-label"
            style={{ display: 'flex', gap: 8, alignItems: 'center' }}
          >
            <span>บุคลากร</span>
            {selected.length > 0 && (
              <button
                type="button"
                className="btn ghost"
                onClick={clearMembers}
                style={{ padding: '4px 8px', fontSize: 12 }}
              >
                ล้าง ({selected.length})
              </button>
            )}
          </div>

          <div className="chips-wrap">
            {activeMembersFirst.map((m) => {
              const isSelected = selected.includes(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`chip chip-select${isSelected ? ' selected' : ''}${
                    m.active ? '' : ' inactive'
                  }`}
                  aria-pressed={isSelected}
                  onClick={() => toggleMember(m.id)}
                  title={m.active ? m.name : `${m.name} (Inactive)`}
                >
                  {m.name}
                </button>
              )
            })}
            {activeMembersFirst.length === 0 && (
              <span className="muted small">ไม่มีบุคลากร</span>
            )}
          </div>
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

      <div className="schedule-row-actions">
        <button
          type="button"
          className="btn primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'กำลังบันทึก…' : 'บันทึกช่วง'}
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
    </div>
  )
}
