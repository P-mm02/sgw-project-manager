// src/app/ManageNotification/EditNotify/editNotify.ts

import { useState } from 'react'
import type { NotificationType } from '@/types/NotificationType'

export type EditFormType = {
  title: string
  detail: string
  notifyDate: string
  notifyBeforeDays: string
  createdBy: string
}

export function useEditNotify(onSaved?: () => void) {
  const [editing, setEditing] = useState<NotificationType | null>(null)
  const [editForm, setEditForm] = useState<EditFormType>({
    title: '',
    detail: '',
    notifyDate: '',
    notifyBeforeDays: '',
    createdBy: '',
  })
  const [saving, setSaving] = useState(false)

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

  function handleNotifyDateChange(notifyDate: string) {
    setEditForm((f) => ({
      ...f,
      notifyDate,
    }))
  }

  async function handleEditSave() {
    if (!editing) return
    setSaving(true)
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
    if (res.ok) {
      if (onSaved) onSaved()
      else window.location.reload()
    } else alert('Edit failed')
  }

  function handleEditCancel() {
    setEditing(null)
  }

  return {
    editing,
    editForm,
    saving,
    handleEditClick,
    handleEditChange,
    handleEditSave,
    handleEditCancel,
    handleNotifyDateChange, // <-- NEW
    setEditing,
    setEditForm,
  }
}
