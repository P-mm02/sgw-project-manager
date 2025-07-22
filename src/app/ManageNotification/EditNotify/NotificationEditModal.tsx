// src/app/ManageNotification/NotificationEditModal/NotificationEditModal.tsx

'use client'

import { useMemo } from 'react'
import type { EditFormType } from './editNotify' // adjust import as needed

type NotificationEditModalProps = {
  open: boolean
  editForm: EditFormType
  saving?: boolean
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onNotifyDateChange: (notifyDate: string) => void
  onSave: () => void
  onCancel: () => void
}

const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
]

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function thaiDateString(ymd: string) {
  const [y, m, d] = ymd.split('-')
  return `${parseInt(d)} ${thaiMonths[parseInt(m) - 1]} พ.ศ. ${
    parseInt(y) + 543
  }`
}

export default function NotificationEditModal({
  open,
  editForm,
  saving = false,
  onChange,
  onNotifyDateChange,
  onSave,
  onCancel,
}: NotificationEditModalProps) {
  if (!open) return null

  const [year, month, day] = editForm.notifyDate
    ? editForm.notifyDate.split('-').map(Number)
    : (() => {
        const now = new Date()
        return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      })()

  const thaiYears = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 11 }, (_, i) => {
      const yearAD = now.getFullYear() - 5 + i
      return {
        label: (yearAD + 543).toString(),
        value: yearAD,
      }
    })
  }, [])

  const daysCount = daysInMonth(year, month)

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = Number(e.target.value)
    const d = Math.min(day, daysInMonth(newYear, month))
    onNotifyDateChange(
      `${newYear}-${String(month).padStart(2, '0')}-${String(d).padStart(
        2,
        '0'
      )}`
    )
  }
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = Number(e.target.value)
    const d = Math.min(day, daysInMonth(year, newMonth))
    onNotifyDateChange(
      `${year}-${String(newMonth).padStart(2, '0')}-${String(d).padStart(
        2,
        '0'
      )}`
    )
  }
  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDay = Number(e.target.value)
    onNotifyDateChange(
      `${year}-${String(month).padStart(2, '0')}-${String(newDay).padStart(
        2,
        '0'
      )}`
    )
  }

  return (
    <div className="notify-edit-modal-overlay" onClick={onCancel}>
      <div className="notify-edit-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="notify-edit-modal-close"
          onClick={onCancel}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <h3>แก้ไขแจ้งเตือน</h3>
        <form
          className="notify-edit-modal-form"
          onSubmit={(e) => {
            e.preventDefault()
            onSave()
          }}
        >
          <label>
            หัวข้อ:
            <input
              name="title"
              value={editForm.title}
              onChange={onChange}
              required
            />
          </label>
          <label>
            รายละเอียด:
            <textarea
              name="detail"
              value={editForm.detail}
              onChange={onChange}
              required
            />
          </label>
          <label>วันครบกำหนด</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span>วันที่</span>
            <select value={day} onChange={handleDayChange}>
              {Array.from({ length: daysCount }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <span>เดือน</span>
            <select value={month} onChange={handleMonthChange}>
              {thaiMonths.map((m, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <span>พ.ศ.</span>
            <select value={year} onChange={handleYearChange}>
              {thaiYears.map((yr) => (
                <option key={yr.value} value={yr.value}>
                  {yr.label}
                </option>
              ))}
            </select>
          </div>
          {editForm.notifyDate && (
            <div
              style={{
                color: '#888',
                fontSize: '0.9em',
                marginBottom: '0.5rem',
              }}
            >
              วันที่: {thaiDateString(editForm.notifyDate)}
            </div>
          )}
          <label>
            แจ้งเตือนล่วงหน้ากี่วัน (เช่น 30,14,7):
            <input
              name="notifyBeforeDays"
              value={editForm.notifyBeforeDays}
              onChange={onChange}
              placeholder="30, 14, 7"
            />
          </label>
          <label>
            สร้างโดย:
            <input
              name="createdBy"
              value={editForm.createdBy}
              onChange={onChange}
              placeholder="ชื่อผู้สร้าง"
            />
          </label>
          <div className="notify-edit-modal-actions">
            <button className="save-btn" type="submit" disabled={saving}>
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button className="cancel-btn" type="button" onClick={onCancel}>
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
