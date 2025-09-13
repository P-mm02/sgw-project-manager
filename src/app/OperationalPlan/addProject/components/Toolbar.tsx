// src/app/OperationalPlan/addProject/components/Toolbar.tsx
'use client'
import React from 'react'

type Props = {
  query: string
  setQuery: (s: string) => void
  fetching: boolean
  onRefresh: () => void
}

export default function Toolbar({
  query,
  setQuery,
  fetching,
  onRefresh,
}: Props) {
  return (
    <div className="op-toolbar">
      <input
        className="op-input"
        placeholder="ค้นหาชื่อโครงการ…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="button"
        className="btn"
        onClick={onRefresh}
        disabled={fetching}
      >
        {fetching ? 'กำลังโหลด…' : 'รีเฟรช'}
      </button>
    </div>
  )
}
