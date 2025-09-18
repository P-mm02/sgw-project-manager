'use client'

import React from 'react'
import { MemberAttrs } from '@/models/OperationalPlan/Member'
import { normalizeHexColor, toInt } from '../lib/memberUtils'

type FormState = {
  name: string
  positions: string
  active: boolean
  indexNumber: number
  backgroundColor: string
}

type Props = {
  members: MemberAttrs[]
  editingId: string | null
  editForm: FormState
  setEditForm: React.Dispatch<React.SetStateAction<FormState>>
  startEdit: (m: MemberAttrs) => void
  cancelEdit: () => void
  saveEdit: () => void
  deletingId: string | null
  handleDelete: (id: string, name: string) => void
}

export default function MemberList({
  members,
  editingId,
  editForm,
  setEditForm,
  startEdit,
  cancelEdit,
  saveEdit,
  deletingId,
  handleDelete,
}: Props) {
  if (members.length === 0) {
    return <div className="muted center">ไม่มีข้อมูล</div>
  }

  return (
    <div className="op-card-grid">
      {members.map((m: any) => {
        const isEditing = editingId === m.id
        const bg = m.backgroundColor ?? m['background-color'] ?? '#e2e8f0'
        const idx = m.indexNumber ?? m['index-number'] ?? 0

        return (
          <div
            key={m.id}
            className="member-card"
            style={{ background: normalizeHexColor(bg) }}
            title={`index-number: ${idx}`}
          >
            {!isEditing ? (
              <>
                <div className="member-header">
                  <h3 className="member-name">
                    <span className="idx-pill" style={{ backgroundColor: bg }}>
                      {idx}
                    </span>
                    {m.name}
                  </h3>
                  <span className={`badge ${m.active ? 'green' : 'gray'}`}>
                    {m.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="member-positions">
                  {Array.isArray(m.positions) && m.positions.length > 0 ? (
                    m.positions.map((p: string, i: number) => (
                      <span key={i} className="chip">
                        {p}
                      </span>
                    ))
                  ) : (
                    <span className="muted">ไม่ระบุ</span>
                  )}
                </div>

                <div className="row-actions">
                  <button className="btn" onClick={() => startEdit(m)}>
                    แก้ไข
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => handleDelete(m.id, m.name)}
                    disabled={deletingId === m.id}
                  >
                    {deletingId === m.id ? 'กำลังลบ…' : 'ลบ'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="member-header">
                  <input
                    className="op-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                  <label className="op-checkbox">
                    <input
                      type="checkbox"
                      checked={editForm.active}
                      onChange={(e) =>
                        setEditForm((s) => ({
                          ...s,
                          active: e.target.checked,
                        }))
                      }
                    />
                    Active
                  </label>
                </div>

                <div className="member-positions grid-2">
                  <input
                    className="op-input"
                    value={editForm.positions}
                    onChange={(e) =>
                      setEditForm((s) => ({
                        ...s,
                        positions: e.target.value,
                      }))
                    }
                    placeholder="คั่นด้วยคอมมา"
                  />
                  <div className="grid-2">
                    <input
                      className="op-input"
                      type="number"
                      value={editForm.indexNumber}
                      onChange={(e) =>
                        setEditForm((s) => ({
                          ...s,
                          indexNumber: toInt(e.target.value, 0),
                        }))
                      }
                      placeholder="index-number"
                      min={0}
                    />
                    <input
                      className="op-input"
                      value={editForm.backgroundColor}
                      onChange={(e) =>
                        setEditForm((s) => ({
                          ...s,
                          backgroundColor: e.target.value,
                        }))
                      }
                      placeholder="#e2e8f0"
                      title="background-color"
                    />
                  </div>
                </div>

                <div className="row-actions">
                  <button className="btn primary" onClick={saveEdit}>
                    บันทึก
                  </button>
                  <button className="btn ghost" onClick={cancelEdit}>
                    ยกเลิก
                  </button>
                </div>
              </>
            )}
          </div>
        )
      })}

    </div>
  )
}
