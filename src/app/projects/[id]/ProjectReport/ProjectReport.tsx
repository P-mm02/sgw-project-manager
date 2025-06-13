'use client'

import type { ProjectType } from '@/models/Project'
import './ProjectReport.css'

export default function ProjectReport({ project }: { project: ProjectType }) {
  return (
    <div className="project-report-container">
      <h2 className="project-report-title">บันทึกการทํางาน</h2>

      <div className="report-section">
        <p className="report-label">รายงานการทํางาน:</p>
        <p className="report-content">
          {project.workLog[0].recordText || 'ไม่มีข้อมูลรายงาน'}
        </p>
      </div>

      <div className="report-section">
        <p className="report-label">เอกสารแนบ:</p>
        {project.documents && project.documents.length > 0 ? (
          <ul className="document-list">
            {project.documents.map((doc, index) => (
              <li key={index} className="document-item">
                {doc}
              </li>
            ))}
          </ul>
        ) : (
          <p className="report-content">ไม่มีเอกสารแนบ</p>
        )}
      </div>
    </div>
  )
}
