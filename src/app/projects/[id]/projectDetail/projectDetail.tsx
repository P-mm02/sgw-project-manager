'use client'

import Link from 'next/link'
import { parse, differenceInCalendarDays } from 'date-fns'
import { formatDateInput } from '@/lib/formatDateInput'
import type { ProjectType } from '@/models/Project'
import "./projectDetail.css";


export default function ProjectDetail({ project }: { project: ProjectType }) {
  const formatDate = (date: string | Date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  const statusToThai = (status: string) => {
    switch (status) {
      case 'planned':
        return 'วางแผน'
      case 'in_progress':
        return 'กำลังดำเนินการ'
      case 'done':
        return 'เสร็จสิ้น'
      default:
        return status
    }
  }

  const workTypeToThai = (type: string) => {
    switch (type) {
      case 'drilling':
        return 'เจาะบ่อ'
      case 'survey':
        return 'สำรวจ'
      case 'dewatering':
        return 'ดูดน้ำ'
      case 'maintenance':
        return 'ซ่อมบำรุง'
      case 'others':
        return 'อื่น ๆ'
      default:
        return type
    }
  }

  return (
    <div className="project-detail-container">
      <h1 className="project-detail-title">{project.projectName}</h1>

      <p className="detail-row">
        <span className="detail-label">สถานที่ตั้ง:</span>
        <span className="detail-value">{project.location || '-'}</span>
      </p>

      <p className="detail-row">
        <span className="detail-label">ลิงค์แผนที่:</span>
        {project.mapLink ? (
          <Link href={project.mapLink} target="_blank" className="">
            <span className="detail-value">{project.mapLink}</span>
          </Link>
        ) : (
          <span className="detail-value">-</span>
        )}
      </p>

      <p className="detail-row">
        <span className="detail-label">ลูกค้า:</span>
        <span className="detail-value">{project.client || '-'}</span>
      </p>

      <p className="detail-row">
        <span className="detail-label">ผู้ควบคุมงาน:</span>
        <span className="detail-value">{project.supervisor || '-'}</span>
      </p>

      <p className="detail-row">
        <span className="detail-label">มูลค่างาน:</span>
        <span className="detail-value">
          ฿{project.projectWorth?.toLocaleString() || '-'}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">สถานะ:</span>
        <span className="detail-value">
          {statusToThai(project.status as string)}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">ประเภทงาน:</span>
        <span className="detail-value">
          {workTypeToThai(project.workType as string)}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">แผนเริ่มงาน:</span>
        <span className="detail-value">
          {formatDate(formatDateInput(project.planWorkDayStart as string))}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">แผนจบงาน:</span>
        <span className="detail-value">
          {formatDate(formatDateInput(project.planWorkDayEnd as string))}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">แผนใช้เวลา รวม:</span>
        <span className="detail-value">
          {project.planWorkDayStart && project.planWorkDayEnd
            ? differenceInCalendarDays(
                parse(project.planWorkDayEnd, 'yyyyMMdd', new Date()),
                parse(project.planWorkDayStart, 'yyyyMMdd', new Date())
              ) + 1
            : '-'}{' '}
          วัน
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">เริ่มปฏิบัติงาน:</span>
        <span className="detail-value">
          {formatDate(formatDateInput(project.actualWorkDayStart as string))}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">จบปฏิบัติงาน:</span>
        <span className="detail-value">
          {formatDate(formatDateInput(project.actualWorkDayEnd as string))}
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">ปฏิบัติงานใช้เวลา รวม:</span>
        <span className="detail-value">
          {project.actualWorkDayStart && project.actualWorkDayEnd
            ? differenceInCalendarDays(
                parse(project.actualWorkDayEnd, 'yyyyMMdd', new Date()),
                parse(project.actualWorkDayStart, 'yyyyMMdd', new Date())
              ) + 1
            : '-'}{' '}
          วัน
        </span>
      </p>

      <p className="detail-row">
        <span className="detail-label">Tags:</span>
        <span className="detail-value">{project.tags?.join(', ') || '-'}</span>
      </p>

      <p className="detail-row">
        <span className="detail-label">รายงาน:</span>
        <span className="detail-value">{project.report || '-'}</span>
      </p>

      <p className="detail-row">
        <span className="detail-label">เอกสาร:</span>
        <span className="detail-value">
          {project.documents?.join(', ') || '-'}
        </span>
      </p>
    </div>
  )
}
