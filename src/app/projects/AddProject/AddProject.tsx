'use client'
import { useState } from 'react'
import './AddProject.css'
import { handleSubmit } from './handleSubmit'
import { formatDateInput } from '@/lib/date/formatDateInput'
import { ProjectFormState } from '@/types/ProjectFormState'
import { initialProjectFormState } from '@/constants/project/initialProjectForm'

const safe = (val: string | undefined | null) => val ?? ''


export default function AddProject() {
  
  const [formData, setFormData] = useState<ProjectFormState>(initialProjectFormState)
  const [preview, setPreview] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    const formattedValue = type === 'date' ? value.replaceAll('-', '') : value

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
  } 

  return (
    <div className="add-project-form">
      <h2 className="add-project-head">เพิ่มโปรเจค</h2>

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

      <label>ชื่อลูกค้า/บริษัทลูกค้า</label>
      <input name="client" value={safe(formData.client)} onChange={handleChange} />

      <label>ผู้รับผิดชอบ</label>
      <input
        name="supervisor"
        value={safe(formData.supervisor)}
        onChange={handleChange}
      />

      <label>มูลค่างาน</label>
      <input
        name="projectWorth"
        value={formData.projectWorth}
        onChange={handleChange}
      />

      <label>สถานะ</label>
      <select name="status" value={safe(formData.status)} onChange={handleChange}>
        <option value="">Select Status</option>
        <option value="planned">Planned</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <label>ประเภทงาน</label>
      <select name="workType" value={safe(formData.workType)} onChange={handleChange}>
        <option value="">Select Type</option>
        <option value="drilling">Drilling</option>
        <option value="survey">Survey</option>
        <option value="dewatering">Dewatering</option>
        <option value="maintenance">Maintenance</option>
        <option value="others">Others</option>
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

      {!preview && <button onClick={() => setPreview(true)}>Preview</button>}

      {preview && (
        <div className="preview-box">
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button
            onClick={() => handleSubmit(formData, setSubmitted, setPreview)}
          >
            Confirm & Save
          </button>

          <button onClick={() => setPreview(false)}>Back</button>
        </div>
      )}

      {submitted && <p>✅ Project saved successfully!</p>}
    </div>
  )
}
