'use client'

import { useState } from 'react'
import type { NotificationType } from '@/types/NotificationType'
import './notifyEditModal.css'

export default function ComingNotify({
  notifications = [],
  loading = false,
  error = null,
}: {
  notifications?: NotificationType[]
  loading?: boolean
  error?: string | null
}) {
  const [editing, setEditing] = useState<NotificationType | null>(null)
  const [editForm, setEditForm] = useState<{
    title: string
    detail: string
    notifyDate: string
    notifyBeforeDays: string
    createdBy: string
  }>({
    title: '',
    detail: '',
    notifyDate: '',
    notifyBeforeDays: '',
    createdBy: '',
  })
  const [saving, setSaving] = useState(false)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Upcoming = notifyDate in the future (or today)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const upcoming = notifications.filter(
    (item) => new Date(item.notifyDate) >= now
  )

  const handleDelete = async (id: string) => {
    if (confirm('ต้องการลบการแจ้งเตือนนี้จริงหรือไม่?')) {
      const res = await fetch('/api/manage-notification/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('ลบไม่สำเร็จ')
      }
    }
  }

  // --- Edit Logic ---
  function handleEditClick(item: NotificationType) {
    setEditing(item)
    setEditForm({
      title: item.title || '',
      detail: item.detail || '',
      notifyDate: item.notifyDate
        ? new Date(item.notifyDate).toISOString().slice(0, 10)
        : '',
      notifyBeforeDays: Array.isArray(item.notifyBeforeDays)
        ? item.notifyBeforeDays.join(', ')
        : '',
      createdBy: item.createdBy || '',
    })
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setEditForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }))
  }

  async function handleEditSave() {
    if (!editing) return
    setSaving(true)
    // Convert notifyBeforeDays from string to array of numbers
    const notifyBeforeDays = editForm.notifyBeforeDays
      .split(',')
      .map((x) => Number(x.trim()))
      .filter((x) => !isNaN(x))
    const res = await fetch('/api/manage-notification/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editing._id || editing.id,
        title: editForm.title,
        detail: editForm.detail,
        notifyDate: editForm.notifyDate,
        notifyBeforeDays,
        createdBy: editForm.createdBy,
      }),
    })
    setSaving(false)
    if (res.ok) window.location.reload()
    else alert('Edit failed')
  }

  function handleEditCancel() {
    setEditing(null)
  }

  return (
    <div className="notification-list">
      {upcoming.length > 0 ? (
        upcoming.map((item) => {
          const notifyDate = new Date(item.notifyDate)
          notifyDate.setHours(0, 0, 0, 0)
          const daysLeft = Math.ceil(
            (notifyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )

          return (
            <div key={item._id || item.id} className="notification-card">
              {/* Absolute Delete Button */}
              <button
                className="delete-btn"
                title="ลบการแจ้งเตือนนี้"
                onClick={() => handleDelete(item._id || item.id)}
                aria-label="ลบ"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className='text-wrap'>
                📅 <strong>{item.title}</strong>
              </div>
              <div className='text-wrap' style={{ whiteSpace: 'pre-line' }}>
                รายละเอียด: {item.detail || '-'}
              </div>
              <div>
                วันครบกำหนด:{' '}
                {new Date(item.notifyDate).toLocaleDateString('th-TH')}
              </div>
              <div>เหลือเวลาอีก: {daysLeft} วัน</div>
              <div className='text-wrap'>
                แจ้งเตือนล่วงหน้า:{' '}
                {Array.isArray(item.notifyBeforeDays) &&
                item.notifyBeforeDays.length > 0
                  ? item.notifyBeforeDays.join(', ') + ' วัน'
                  : 'ไม่ระบุ'}{' '}
              </div>
              <div className='text-wrap'>
                {Array.isArray(item.notifiedDays) &&
                item.notifiedDays.length > 0
                  ? `แจ้งล่วงหน้าแล้ว: ${item.notifiedDays.join(', ')} วัน`
                  : 'ยังไม่มีการแจ้งเตือนล่วงหน้า'}
              </div>
              <div className='text-wrap'>
                สถานะ: {item.isNotified ? 'แจ้งเตือนครบแล้ว' : 'รอแจ้งเตือน'}
              </div>
              <div>สร้างโดย: {item.createdBy || '-'}</div>
              <div style={{ fontSize: '0.9em', color: '#888' }}>
                สร้างเมื่อ:{' '}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString('th-TH')
                  : '-'}
              </div>
              <button
                className="notify-edit"
                onClick={() => handleEditClick(item)}
              >
                แก้ไข
              </button>
            </div>
          )
        })
      ) : (
        <div style={{ color: '#aaa' }}>
          ไม่พบการแจ้งเตือนที่กำลังจะมาถึง
        </div>
      )}

      {/* --- Modal --- */}
      {editing && (
        <div
          className="notify-edit-modal-overlay"
          onClick={handleEditCancel}
        >
          <div 
            className="notify-edit-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="notify-edit-modal-close"
              onClick={handleEditCancel}
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
                handleEditSave()
              }}
            >
              <label>
                หัวข้อ:
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                รายละเอียด:
                <textarea
                  name="detail"
                  value={editForm.detail}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                วันครบกำหนด:
                <input
                  type="date"
                  name="notifyDate"
                  value={editForm.notifyDate}
                  onChange={handleEditChange}
                  required
                />
              </label>
              <label>
                แจ้งเตือนล่วงหน้ากี่วัน (เช่น 30,14,7):
                <input
                  name="notifyBeforeDays"
                  value={editForm.notifyBeforeDays}
                  onChange={handleEditChange}
                  placeholder="30, 14, 7"
                />
              </label>
              <label>
                สร้างโดย:
                <input
                  name="createdBy"
                  value={editForm.createdBy}
                  onChange={handleEditChange}
                  placeholder="ชื่อผู้สร้าง"
                />
              </label>
              <div className="notify-edit-modal-actions">
                <button className="save-btn" type="submit" disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={handleEditCancel}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
