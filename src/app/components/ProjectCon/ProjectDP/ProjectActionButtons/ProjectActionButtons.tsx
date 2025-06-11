'use client'
import React from 'react'
import './ProjectActionButtons.css'
import Link from 'next/link'

type ProjectActionButtonsProps = {
  projectId: string
  onDelete: (id: string) => void
}

export default function ProjectActionButtons({
  projectId,
  onDelete,
}: ProjectActionButtonsProps) {
  return (
    <div className="project-btn-con">
      <Link href={`/projects/${projectId}/edit`} className="btn-edit">
        ✏️ แก้ไข
      </Link>
      <button className="btn-report">📄 รายงาน</button>
      <button className="btn-map">🗺️ แผนที่</button>
      <button className="btn-layout">📐 แผนผัง</button>
      <Link href={`/projects/${projectId}`} className="btn-detail">
        🔍 รายละเอียด
      </Link>
      <button className="btn-delete" onClick={() => onDelete(projectId)}>
        🗑️ ลบ
      </button>
    </div>
  )
}
