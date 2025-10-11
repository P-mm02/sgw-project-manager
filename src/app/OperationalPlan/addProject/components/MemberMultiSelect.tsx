// src/app/OperationalPlan/addProject/components/MemberMultiSelect.tsx
'use client'

import React from 'react'
import type { Member } from '../types'
import './MemberMultiSelect.css'

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

      <div className="chips-wrap" role="listbox" aria-multiselectable="true">
        {members.map((m) => {
          //console.log('Sample member color:', m?.name, m?.backgroundColor)        
          const isSelected = value.includes(m._id)
          // accept both camelCase and kebab-case from API
          const bg =
            (m as any).backgroundColor ??
            (m as any)['background-color'] ??
            '#e2e8f0'

          
          return (
            <button
              key={m._id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`chip-select${isSelected ? ' selected' : ''}${
                m.active ? '' : ' inactive'
              }`}
              onClick={() => toggle(m._id)}
              title={m.name}
              style={{
                background: bg,
                color: '#000000ff',
              }}
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
