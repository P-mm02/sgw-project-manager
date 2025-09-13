'use client'

import React from 'react'
import type { Member } from '../types'

type Props = {
  members: Member[]
  value: string[]
  onChange: (ids: string[]) => void
}

export default function MemberMultiSelect({ members, value, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id]
    )
  }

  const clear = () => onChange([])

  return (
    <div>
      <div
        className="small-label"
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <span>บุคลากร</span>
        {value.length > 0 && (
          <button
            type="button"
            className="btn ghost"
            onClick={clear}
            style={{ padding: '4px 8px', fontSize: 12 }}
          >
            ล้าง ({value.length})
          </button>
        )}
      </div>
      <div className="chips-wrap">
        {members.map((m) => {
          const isSelected = value.includes(m.id)
          return (
            <button
              key={m.id}
              type="button"
              className={`chip chip-select${isSelected ? ' selected' : ''}${
                m.active ? '' : ' inactive'
              }`}
              onClick={() => toggle(m.id)}
            >
              {m.name}
            </button>
          )
        })}
        {members.length === 0 && (
          <span className="muted small">ไม่มีบุคลากร</span>
        )}
      </div>
    </div>
  )
}
