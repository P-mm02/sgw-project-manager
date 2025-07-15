// src/app/ManageNotification/NotificationEditModal/NotificationEditModal.tsx
'use client'

import React from 'react'

export type EditFormType = {
  title: string
  detail: string
  notifyDate: string
  notifyBeforeDays: string
  createdBy: string
}

type NotificationEditModalProps = {
  open: boolean
  editForm: EditFormType
  saving?: boolean
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onSave: () => void
  onCancel: () => void
}

export default function NotificationEditModal({
  open,
  editForm,
  saving = false,
  onChange,
  onSave,
  onCancel,
}: NotificationEditModalProps) {
  if (!open) return null

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
          <label>
            วันครบกำหนด:
            <input
              type="date"
              name="notifyDate"
              value={editForm.notifyDate}
              onChange={onChange}
              required
            />
          </label>
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
