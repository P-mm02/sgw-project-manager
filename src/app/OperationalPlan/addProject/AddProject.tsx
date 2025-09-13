// src/app/OperationalPlan/addProject/AddProject.tsx
'use client'

import React, { useMemo, useState } from 'react'
import { toLocalDateString, isValidYMD, isDateOrderOK } from './helpers'
import type { Member } from './types'
import MemberMultiSelect from './components/MemberMultiSelect'
import './AddProject.css'
import DateInputTH from '@/components/DateInputTH'



type ScheduleEntryInput = {
  startDate: string
  endDate: string
  memberIds: string[]
  note?: string
}

type Props = {
  members: Member[] // <-- pass members in
  onSuccess: () => void
  setError: (msg: string | null) => void
  setSuccess: (msg: string) => void
}

export default function AddProject({
  members,
  onSuccess,
  setError,
  setSuccess,
}: Props) {
  const [projectName, setProjectName] = useState('')
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [newSchedules, setNewSchedules] = useState<ScheduleEntryInput[]>([
    {
      startDate: toLocalDateString(new Date()),
      endDate: toLocalDateString(new Date()),
      memberIds: [],
      note: '',
    },
  ])

  const memberSelectSize = useMemo(
    () => Math.min(6, Math.max(3, members.length || 0)),
    [members.length]
  )

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
    setError(null)
    if (!projectName.trim()) {
      setError('กรุณากรอกชื่อโปรเจ็กต์')
      return
    }
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
      onSuccess()
    } catch (e: any) {
      setError(e.message || 'เพิ่มโปรเจ็กต์ไม่สำเร็จ')
    } finally {
      setLoadingAdd(false)
    }
  }

  return (
    <form className="op-card op-form" onSubmit={handleAddProject}>
      <div className="op-form-row">
        <label htmlFor="projectName">ชื่อโครงการ</label>
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
        <label>ช่วงการทำงาน (เพิ่มได้หลายช่วง)</label>

        {newSchedules.map((s, idx) => (
          <div key={idx} className="schedule-row">
            <div className="schedule-grid">
              <div>
                <span className="small-label">เริ่ม</span>
                <DateInputTH
                  value={s.startDate}
                  onChange={(v) => updateScheduleRow(idx, { startDate: v })}
                />
              </div>
              <div>
                <span className="small-label">สิ้นสุด</span>
                <DateInputTH
                  value={s.endDate}
                  min={s.startDate || undefined}
                  onChange={(v) => updateScheduleRow(idx, { endDate: v })}
                />
              </div>

              <div>
                <MemberMultiSelect
                  members={members}
                  value={s.memberIds}
                  onChange={(ids) => updateScheduleRow(idx, { memberIds: ids })}
                />
              </div>

              <div className="schedule-note">
                <span className="small-label">หมายเหตุ</span>
                <input
                  className="op-input"
                  value={s.note || ''}
                  onChange={(e) =>
                    updateScheduleRow(idx, { note: e.target.value })
                  }
                  placeholder="ตัวอย่าง: เข้าไปติดตั้งเครื่องสูบ สูบทดสอบ"
                />
              </div>
            </div>

            <div className="project-row-actions">
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
            setError(null)
            setSuccess('')
          }}
          disabled={loadingAdd}
        >
          ล้างฟอร์ม
        </button>
      </div>
    </form>
  )
}
