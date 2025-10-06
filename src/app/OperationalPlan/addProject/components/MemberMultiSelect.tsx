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

/** Safe hex color normalizer -> '#rrggbb' (fallback '#e2e8f0') */
function normalizeHexColor(v: unknown, fallback = '#e2e8f0'): string {
  if (typeof v !== 'string') return fallback
  let s = v.trim().toLowerCase()
  if (s.startsWith('0x')) s = s.slice(2)
  if (s.startsWith('#')) s = s.slice(1)
  if (/^[0-9a-f]{3}$/.test(s))
    s = s
      .split('')
      .map((ch) => ch + ch)
      .join('')
  if (!/^[0-9a-f]{6}$/.test(s)) return fallback
  return `#${s}`
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
          const isSelected = value.includes(m.id)
          // accept both camelCase and kebab-case from API
          const rawBg =
            (m as any).backgroundColor ??
            (m as any)['background-color'] ??
            '#e2e8f0'
          const bg = normalizeHexColor(rawBg)

          // keep edge visible for very light backgrounds
          const needsBorder =
            bg.toLowerCase() === '#ffffff' || bg.toLowerCase() === '#e2e8f0'

          return (
            <button
              key={m.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`chip-select${isSelected ? ' selected' : ''}${
                m.active ? '' : ' inactive'
              }`}
              onClick={() => toggle(m.id)}
              title={m.name}
              style={{
                background: bg,
                border: needsBorder
                  ? '1px solid #cbd5e1'
                  : '1px solid transparent',
                boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.12)' : 'none',
                color: '#111827',
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
