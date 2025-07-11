'use client'

import { useState, useMemo } from 'react'
import type { NotificationType } from '@/types/NotificationType'
import { initialNotificationFormState } from '@/constants/notification/initialNotificationFormState'
import { thaiMonths, daysInMonth, thaiDateString } from './Function'

type CreateNotifyProps = {
  onCreated?: () => void
}

type NotificationCreateInput = Omit<
  NotificationType,
  '_id' | 'createdAt' | 'updatedAt' | 'notifiedDays' | 'isNotified'
> & {
  notifiedDays?: number[]
  isNotified?: boolean
}

export default function CreateNotify({ onCreated }: CreateNotifyProps) {
  const [form, setForm] = useState(initialNotificationFormState)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Generate BE years (current year +/- 5)
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

  // Date part selection helpers
  const currentDate = form.notifyDate ? new Date(form.notifyDate) : new Date()
  const selectedYear = currentDate.getFullYear()
  const selectedMonth = currentDate.getMonth() + 1
  const selectedDay = currentDate.getDate()
  const daysCount = daysInMonth(selectedYear, selectedMonth)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.id]: e.target.value })

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(e.target.value)
    const month = selectedMonth
    const day = Math.min(selectedDay, daysInMonth(year, month))
    setForm({
      ...form,
      notifyDate: `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`,
    })
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = Number(e.target.value)
    const year = selectedYear
    const day = Math.min(selectedDay, daysInMonth(year, month))
    setForm({
      ...form,
      notifyDate: `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`,
    })
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const day = Number(e.target.value)
    setForm({
      ...form,
      notifyDate: `${selectedYear}-${selectedMonth
        .toString()
        .padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    })
  }

  const clearForm = () => setForm(initialNotificationFormState)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (!form.title.trim() || !form.detail.trim()) {
      setMessage('กรุณากรอกหัวข้อและรายละเอียด')
      setLoading(false)
      return
    }

    let beforeDaysArr: number[] = []
    if (form.notifyBeforeDays.trim()) {
      beforeDaysArr = form.notifyBeforeDays
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n >= 0)
    }

    const body: NotificationCreateInput = {
      title: form.title,
      detail: form.detail,
      notifyBeforeDays: beforeDaysArr,
      notifiedDays: [],
      isNotified: false,
      notifyDate: form.notifyDate
        ? new Date(form.notifyDate).toISOString()
        : new Date().toISOString(),
      createdBy: form.createdBy,
    }

    try {
      const res = await fetch('/api/manage-notification/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setMessage('Notification created successfully!')
        clearForm()
        if (onCreated) onCreated()
      } else {
        const data = await res.json()
        setMessage(data.error || 'Failed to create notification')
      }
    } catch {
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="notify-form">
      <label htmlFor="title">หัวข้อแจ้งเตือน</label>
      <input
        id="title"
        type="text"
        placeholder="หัวข้อแจ้งเตือน"
        value={form.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="detail">รายละเอียด</label>
      <textarea
        id="detail"
        placeholder="รายละเอียด"
        value={form.detail}
        onChange={handleChange}
        required
      />

      <label htmlFor="notifyDate">วันที่ต้องการแจ้งเตือน</label>
      <div className="notify-date-input-container">
        {/* Hidden real input for form value */}
        <input
          style={{ display: 'none' }}
          id="notifyDate"
          type="date"
          value={form.notifyDate}
          onChange={handleChange}
          required
        />

        <div>
          <span>วันที่ </span>
          <select value={selectedDay} onChange={handleDayChange}>
            {Array.from({ length: daysCount }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span> เดือน </span>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {thaiMonths.map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span> พ.ศ. </span>
          <select value={selectedYear} onChange={handleYearChange}>
            {thaiYears.map((year) => (
              <option key={year.value} value={year.value}>
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {form.notifyDate && (
        <div
          style={{ color: '#888', fontSize: '0.9em', marginBottom: '0.5rem' }}
        >
          วันที่: {thaiDateString(form.notifyDate)}
        </div>
      )}

      <label htmlFor="notifyBeforeDays">
        แจ้งเตือนล่วงหน้ากี่วัน{' '}
        <span style={{ fontWeight: 'normal' }}>(คั่นด้วย , เช่น 90,60,30)</span>
      </label>
      <input
        id="notifyBeforeDays"
        type="text"
        placeholder="ตัวอย่าง 1,3,7,30"
        value={form.notifyBeforeDays}
        onChange={handleChange}
      />

      <label htmlFor="createdBy">ผู้สร้าง</label>
      <input
        id="createdBy"
        type="text"
        placeholder="ชื่อผู้ที่สร้างการแจ้งเตือนนี้"
        value={form.createdBy}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'บันทึก'}
      </button>
      {message && (
        <div style={{ color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </div>
      )}
    </form>
  )
}
