'use client'

import React from 'react'

type Props = {
  query: string
  setQuery: (v: string) => void
  showActiveOnly: 'all' | 'true' | 'false'
  setShowActiveOnly: (v: 'all' | 'true' | 'false') => void
  fetching: boolean
  onRefresh: () => void
}

export default function Toolbar({
  query,
  setQuery,
  showActiveOnly,
  setShowActiveOnly,
  fetching,
  onRefresh,
}: Props) {
  return (
    <div className="op-toolbar">
      <input
        className="op-input"
        placeholder="ค้นหาชื่อ…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        className="op-input"
        value={showActiveOnly}
        onChange={(e) => setShowActiveOnly(e.target.value as any)}
        title="Filter Active"
      >
        <option value="all">ทั้งหมด</option>
        <option value="true">Active เท่านั้น</option>
        <option value="false">Inactive เท่านั้น</option>
      </select>
      <button className="btn" onClick={onRefresh} disabled={fetching}>
        {fetching ? <></> : 'รีเฟรช'}
      </button>
    </div>
  )
}
