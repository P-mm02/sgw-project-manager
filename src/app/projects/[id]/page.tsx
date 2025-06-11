import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/project-utils'
import './ProjectDetailPage.css'

type ProjectDetailPageProps = {
  params: {
    id: string
  }
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const projectID = await params
  const project = await getProjectById(projectID.id)
  console.log(params);
  

  if (!project) notFound()

  return (
    <div className="project-detail-container">
      <h1 className="project-detail-title">{project.projectName}</h1>

      <Detail label="สถานที่ตั้ง" value={project.location} />
      <Detail label="ละติจูด" value={project.latlng?.lat} />
      <Detail label="ลองจิจูด" value={project.latlng?.lng} />
      <Detail label="ลูกค้า" value={project.client} />
      <Detail label="ผู้ควบคุมงาน" value={project.supervisor} />
      <Detail
        label="มูลค่างาน"
        value={`฿${project.projectWorth?.toLocaleString()}`}
      />
      <Detail label="สถานะ" value={statusToThai(project.status)} />
      <Detail label="ประเภทงาน" value={workTypeToThai(project.workType)} />

      <Detail
        label="แผนเริ่มงาน"
        value={formatDate(project.planWorkDayStart)}
      />
      <Detail label="แผนจบงาน" value={formatDate(project.planWorkDayEnd)} />
      <Detail
        label="เริ่มปฏิบัติงาน"
        value={formatDate(project.actualWorkDayStart)}
      />
      <Detail
        label="จบปฏิบัติงาน"
        value={formatDate(project.actualWorkDayEnd)}
      />

      <Detail label="Tags" value={project.tags?.join(', ')} />
      <Detail label="รายงาน" value={project.report} />
      <Detail label="เอกสาร" value={project.documents?.join(', ')} />
      
    </div>
  )
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <p className="detail-row">
      <span className="detail-label">{label}:</span>
      <span className="detail-value">{value || '-'}</span>
    </p>
  )
}

function formatDate(date: string | Date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function statusToThai(status: string) {
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

function workTypeToThai(type: string) {
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
