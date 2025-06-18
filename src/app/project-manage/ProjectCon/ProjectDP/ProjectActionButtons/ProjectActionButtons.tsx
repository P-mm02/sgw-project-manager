'use client'
import React from 'react'
import './ProjectActionButtons.css'
import Link from 'next/link'

type ProjectActionButtonsProps = {
  projectId: string
  mapLink: string
  onDelete: (id: string) => void
}

export default function ProjectActionButtons({
  projectId,
  onDelete,
  mapLink,
}: ProjectActionButtonsProps) {
  return (
    <div className="project-btn-con">
      <Link
        href={`/projects/${projectId}/edit`}
        className="btn-edit"
        onClick={(e) => e.stopPropagation()}
      >
        ✏️ แก้ไข
      </Link>
      <button className="btn-report" onClick={(e) => e.stopPropagation()}>
        📄 รายงาน
      </button>
      <Link
        href={mapLink}
        target="_blank"
        className="btn-map"
        onClick={(e) => e.stopPropagation()}
      >
        🗺️ แผนที่
      </Link>
      <button className="btn-layout" onClick={(e) => e.stopPropagation()}>
        📐 แผนผัง
      </button>
      <Link
        href={`/projects/${projectId}`}
        className="btn-detail"
        onClick={(e) => e.stopPropagation()}
      >
        🔍 รายละเอียด
      </Link>
      <button
        className="btn-delete"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(projectId)
        }}
      >
        🗑️ ลบ
      </button>
    </div>
  )
}
