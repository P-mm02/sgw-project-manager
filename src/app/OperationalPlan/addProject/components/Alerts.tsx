// src/app/OperationalPlan/addProject/components/Alerts.tsx
'use client'
import React from 'react'

export default function Alerts({
  error,
  success,
}: {
  error: string | null
  success: string
}) {
  if (!error && !success) return null
  return (
    <div className="op-alerts">
      {error && <div className="op-alert error">{error}</div>}
      {success && <div className="op-alert success">{success}</div>}
    </div>
  )
}
