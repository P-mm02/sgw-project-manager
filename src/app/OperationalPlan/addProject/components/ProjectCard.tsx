// src/app/OperationalPlan/addProject/components/ProjectCard.tsx
'use client'

import React from 'react'
import type { Project } from '../types'

type Props = {
  project: Project
  isEditing: boolean
  isExpanded: boolean

  editProjectName: string
  onChangeProjectName: (s: string | ((v: string) => string)) => void

  onToggleExpand: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onDelete: () => void

  summaryMembers?: string[] // <-- NEW
}

export default function ProjectCard({
  project,
  isEditing,
  isExpanded,
  editProjectName,
  onChangeProjectName,
  onToggleExpand,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  summaryMembers = [], // <-- NEW
}: Props) {
  if (isEditing) {
    return (
      <>
        <div className="member-header">
          <input
            className="op-input"
            value={editProjectName}
            onChange={(e) => onChangeProjectName(e.target.value)}
          />
        </div>
        <div className="row-actions">
          <button type="button" className="btn primary" onClick={onSaveEdit}>
            บันทึก
          </button>
          <button type="button" className="btn ghost" onClick={onCancelEdit}>
            ยกเลิก
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="member-header">
        <h3 className="member-name">{project.projectName}</h3>
        <div className="project-badges">
          <span className="project-badge nowrap">
            {project.schedule?.length || 0} ช่วง
          </span>
        </div>
      </div>

      {/* Small member summary row */}
      {summaryMembers.length > 0 && (
        <div className="chips" style={{ marginTop: 8 }}>
          {summaryMembers.map((name, i) => (
            <span key={i} className="chip">
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="row-actions">
        <button type="button" className="btn" onClick={onToggleExpand}>
          {isExpanded ? 'ซ่อนแผนการทำงาน' : 'แสดงแผนการทำงาน'}
        </button>
        <button type="button" className="btn" onClick={onStartEdit}>
          แก้ไขชื่อ
        </button>
        <button type="button" className="btn danger" onClick={onDelete}>
          ลบโครงการ
        </button>
      </div>
    </>
  )
}
