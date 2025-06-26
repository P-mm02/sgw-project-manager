'use client'
import { useState } from 'react'
import './EditProjectForm.css'
import { formatDateInput } from '@/lib/date/formatDateInput'
import type { ProjectType } from '@/types/ProjectType'

const safe = (val: string | undefined | null) => val ?? ''


type Props = {
  initialData: ProjectType
}

export default function EditProjectForm({ initialData }: Props) {
  const [formData, setFormData] = useState({
    ...initialData,
    tags: initialData.tags?.join(', ') || '',
    documents: initialData.documents?.join(', ') || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    const formattedValue = type === 'date' ? value.replaceAll('-', '') : value

    setFormData((prev: typeof formData) => ({ ...prev, [name]: formattedValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const updatedData = {
      ...formData,
      projectWorth: parseFloat(safe(formData.projectWorth)),
      tags: formData.tags.split(',').map((tag: string) => tag.trim()),
      documents: formData.documents.split(',').map((doc: string) => doc.trim()),
    }
      

    try {
      const res = await fetch(`/api/projects/${formData._id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      if (res.ok) {
        alert('✅ แก้ไขสำเร็จ')
      } else {
        alert('❌ บันทึกล้มเหลว')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>ชื่อโครงการ</label>
      <input
        name="projectName"
        value={safe(formData.projectName)}
        onChange={handleChange}
      />

      <label>สถานที่ตั้ง</label>
      <input
        name="location"
        value={safe(formData.location)}
        onChange={handleChange}
      />

      <label>ลิงค์แผนที่</label>
      <input name="mapLink" value={safe(formData.mapLink)} onChange={handleChange} />

      <label>ลูกค้า</label>
      <input name="client" value={safe(formData.client)} onChange={handleChange} />

      <label>ผู้ควบคุมงาน</label>
      <input
        name="supervisor"
        value={safe(formData.supervisor)}
        onChange={handleChange}
      />

      <label>มูลค่างาน</label>
      <input
        name="projectWorth"
        value={safe(formData.projectWorth)}
        onChange={handleChange}
      />

      <label>สถานะ</label>
      <select name="status" value={safe(formData.status)} onChange={handleChange}>
        <option value="planned">วางแผน</option>
        <option value="in_progress">กำลังดำเนินการ</option>
        <option value="done">เสร็จสิ้น</option>
      </select>

      <label>ประเภทงาน</label>
      <select name="workType" value={safe(formData.workType)} onChange={handleChange}>
        <option value="drilling">เจาะบ่อ</option>
        <option value="survey">สำรวจ</option>
        <option value="dewatering">ดูดน้ำ</option>
        <option value="maintenance">ซ่อมบำรุง</option>
        <option value="others">อื่น ๆ</option>
      </select>

      <label>แผนเริ่มงาน</label>
      <input
        type="date"
        name="planWorkDayStart"
        value={formatDateInput(safe(formData.planWorkDayStart))}
        onChange={handleChange}
      />

      <label>แผนจบงาน</label>
      <input
        type="date"
        name="planWorkDayEnd"
        value={formatDateInput(safe(formData.planWorkDayEnd))}
        onChange={handleChange}
      />

      <label>เริ่มปฏิบัติงาน</label>
      <input
        type="date"
        name="actualWorkDayStart"
        value={formatDateInput(safe(formData.actualWorkDayStart))}
        onChange={handleChange}
      />

      <label>จบปฏิบัติงาน</label>
      <input
        type="date"
        name="actualWorkDayEnd"
        value={formatDateInput(safe(formData.actualWorkDayEnd))}
        onChange={handleChange}
      />

      <label>Tags (comma-separated)</label>
      <input name="tags" value={formData.tags} onChange={handleChange} />

      <label>รายงาน</label>
      <input name="report" value={safe(formData.report)} onChange={handleChange} />

      <label>เอกสาร (comma-separated)</label>
      <input
        name="documents"
        value={formData.documents}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        💾 บันทึกการแก้ไข
      </button>
    </form>
  )
}
