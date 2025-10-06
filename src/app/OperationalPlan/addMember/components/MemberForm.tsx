// src/app/OperationalPlan/addMember/components/MemberForm.tsx
'use client'

import React from 'react'
import { toInt } from '../lib/memberUtils'

export type FormState = {
  name: string
  positions: string
  active: boolean
  indexNumber: number
  backgroundColor: string
}

type Props = {
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  membersLength: number
}

// 12 preset colors (no pink; includes white)
const BG_COLORS = [
  '#e2e8f0', // slate-200 (default)
  '#ffffff', // white (new)
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

export default function MemberForm({
  form,
  setForm,
  loading,
  onSubmit,
  membersLength,
}: Props) {
  const setBg = (hex: string) =>
    setForm((s) => ({ ...s, backgroundColor: hex }))

  const resetForm = () =>
    setForm({
      name: '',
      positions: '',
      active: true,
      indexNumber: 0,
      backgroundColor: BG_COLORS[0],
    })

  return (
    <form className="op-card op-form" onSubmit={onSubmit}>
      <div className="op-form-row">
        <label htmlFor="name">ชื่อ</label>
        <input
          id="name"
          className="op-input"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          placeholder="เช่น เติ้ง"
          maxLength={50}
          required
        />
      </div>

      <div className="op-form-row">
        <label htmlFor="positions">ตำแหน่ง</label>
        <input
          id="positions"
          className="op-input"
          value={form.positions}
          onChange={(e) =>
            setForm((s) => ({ ...s, positions: e.target.value }))
          }
          placeholder="คั่นด้วยคอมมา เช่น หน.หน่วยเจาะ, ช่างสำรวจ"
        />
      </div>

      <div className="op-form-row grid-2">
        <div>
          <label htmlFor="indexNumber">ลำดับ </label>
          <input
            id="indexNumber"
            type="number"
            className="op-input"
            value={form.indexNumber || membersLength + 1}
            onChange={(e) =>
              setForm((s) => ({ ...s, indexNumber: toInt(e.target.value, 0) }))
            }
            min={0}
          />
        </div>

        {/* Color select (dropdown + swatches) */}
        <div>
          <label htmlFor="bgColor">สีพื้นหลัง </label>

          {/* Dropdown for accessibility / keyboard selection */}
          <select
            id="bgColor"
            className="op-input"
            value={form.backgroundColor}
            onChange={(e) => setBg(e.target.value)}
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
                form.backgroundColor.toLowerCase() === c.toLowerCase()
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
                    boxShadow: selected ? '0 0 0 2px #93c5fd inset' : 'none',
                    cursor: 'pointer',
                  }}
                />
              )
            })}
          </div>

          {/* Live preview bar */}
          <div
            aria-hidden="true"
            style={{
              marginTop: 10,
              height: 8,
              borderRadius: 4,
              background: form.backgroundColor || BG_COLORS[0],
              border: '1px solid #cbd5e1',
            }}
          />
        </div>
      </div>

      <div className="op-form-row inline">
        <label className="op-checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm((s) => ({ ...s, active: e.target.checked }))
            }
          />
          <span>Active</span>
        </label>
      </div>

      <div className="op-actions">
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'กำลังบันทึก…' : 'เพิ่มสมาชิก'}
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={resetForm}
          disabled={loading}
        >
          ล้างฟอร์ม
        </button>
      </div>
    </form>
  )
}
