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
}

export default function MemberForm({
  form,
  setForm,
  loading,
  onSubmit,
}: Props) {
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
          <label htmlFor="indexNumber">ลำดับ (index-number)</label>
          <input
            id="indexNumber"
            type="number"
            className="op-input"
            value={form.indexNumber}
            onChange={(e) =>
              setForm((s) => ({ ...s, indexNumber: toInt(e.target.value, 0) }))
            }
            min={0}
          />
        </div>
        <div>
          <label htmlFor="bgColor">สีพื้นหลัง (background-color)</label>
          <input
            id="bgColor"
            className="op-input"
            value={form.backgroundColor}
            onChange={(e) =>
              setForm((s) => ({ ...s, backgroundColor: e.target.value }))
            }
            placeholder="#e2e8f0"
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
          onClick={() =>
            setForm({
              name: '',
              positions: '',
              active: true,
              indexNumber: 0,
              backgroundColor: '#e2e8f0',
            })
          }
          disabled={loading}
        >
          ล้างฟอร์ม
        </button>
      </div>
    </form>
  )
}
