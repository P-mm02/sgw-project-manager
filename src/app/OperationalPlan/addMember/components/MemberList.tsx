// src/app/OperationalPlan/addMember/components/MemberList.tsx
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

// 12 preset colors (no pink; includes white)
const BG_COLORS = [
  '#e2e8f0', // slate-200 (default)
  '#ffffff', // white
  '#fde68a', // amber-200
  '#fed7aa', // orange-200
  '#fecaca', // red-200
  '#fecdd3', // rose-200
  '#f5d0fe', // fuchsia-200
  '#e9d5ff', // purple-200
  '#c7d2fe', // indigo-200
  '#bae6fd', // sky-200
  '#a7f3d0', // emerald-200
  '#99f6e4', // teal-200
]

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

  const setBg = (hex: string) =>
    setEditForm((s) => ({ ...s, backgroundColor: hex }))

  return (
    <div className="op-card-grid">
      {members.map((m: any) => {
        const isEditing = editingId === m.id
        const rawBg = m.backgroundColor ?? m['background-color'] ?? '#e2e8f0'
        const bg = normalizeHexColor(rawBg)
        const idx = m.indexNumber ?? m['index-number'] ?? 0

        return (
          <div
            key={m.id}
            className="member-card"
            style={{ background: bg }}
            title={`index-number: ${idx}`}
          >
            {!isEditing ? (
              <>
                <div className="member-header">
                  <h3 className="member-name">
                    <span
                      className="idx-pill"
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #cbd5e1',
                        borderRadius: '50%',
                        boxShadow:
                          // inner bevels
                          'inset 0 2px 6px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(0,0,0,0.06),' +
                          // soft outer lift
                          '0 2px 3px rgba(0,0,0,0.06), 0 6px 12px rgba(0,0,0,0.12)',
                      }}
                    >
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
                  <h4>ชื่อ</h4>
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

                <div className="member-header">
                  <input
                    className="op-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                </div>

                <div className="member-positions grid-2">
                  <h4>ตำแหน่ง หน้าที่</h4>
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

                  <h4>ลำดับที่</h4>
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

                  <h4>สีพื้นหลัง</h4>
                  <div>
                    {/* Dropdown for accessibility */}
                    <select
                      className="op-input"
                      value={editForm.backgroundColor}
                      onChange={(e) => setBg(e.target.value)}
                      title="background-color"
                    >
                      {BG_COLORS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {/* Swatches */}
                    <div
                      role="radiogroup"
                      aria-label="เลือกสีพื้นหลัง"
                      className="op-color-swatches"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(6, 28px)',
                        gap: '8px',
                        marginTop: '8px',
                      }}
                    >
                      {BG_COLORS.map((c) => {
                        const selected =
                          (editForm.backgroundColor || '').toLowerCase() ===
                          c.toLowerCase()
                        return (
                          <button
                            key={c}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            title={c}
                            onClick={() => setBg(c)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 6,
                              background: c,
                              border: selected
                                ? '2px solid #111827'
                                : '1px solid #cbd5e1',
                              boxShadow: selected
                                ? '0 0 0 2px #93c5fd inset'
                                : 'none',
                              cursor: 'pointer',
                            }}
                          />
                        )
                      })}
                    </div>

                    {/* Live preview */}
                    <div
                      aria-hidden="true"
                      style={{
                        marginTop: 10,
                        height: 8,
                        borderRadius: 4,
                        background: editForm.backgroundColor || BG_COLORS[0],
                        border: '1px solid #cbd5e1',
                      }}
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
