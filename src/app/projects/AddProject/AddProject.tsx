'use client'
import { useState } from 'react'
import './AddProject.css'
import { handleSubmit } from './handleSubmit'
import { formatDateInput } from '@/lib/date/formatDateInput'
import { ProjectFormState } from '@/types/ProjectFormState'
import { initialProjectFormState } from '@/constants/project/initialProjectForm'
import { useRouter } from 'next/navigation'

const safe = (val: string | undefined | null) => val ?? ''

export default function AddProject() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormState>(
    initialProjectFormState
  )
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

      <label>
        ชื่อโครงการ
        <input
          name="projectName"
          value={safe(formData.projectName)}
          onChange={handleChange}
        />
      </label>

      <label>
        สถานที่ตั้ง
        <input
          name="location"
          value={safe(formData.location)}
          onChange={handleChange}
        />
      </label>

      <label>
        ลิงค์แผนที่
        <input
          name="mapLink"
          value={safe(formData.mapLink)}
          onChange={handleChange}
        />
      </label>

      <label>
        ชื่อลูกค้า/บริษัทลูกค้า
        <input
          name="client"
          value={safe(formData.client)}
          onChange={handleChange}
        />
      </label>

      <label>
        ผู้รับผิดชอบ
        <input
          name="supervisor"
          value={safe(formData.supervisor)}
          onChange={handleChange}
        />
      </label>

      <label>
        มูลค่างาน
        <input
          name="projectWorth"
          value={formData.projectWorth}
          onChange={handleChange}
        />
      </label>

      <label>
        สถานะ
        <select
          name="status"
          value={safe(formData.status)}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      <label>
        ประเภทงาน
        <select
          name="workType"
          value={safe(formData.workType)}
          onChange={handleChange}
        >
          <option value="">--เลือกประเภท--</option>
          <option value="drilling">เจาะ</option>
          <option value="survey">สำรวจ</option>
          <option value="dewatering">สูบลดระดับน้ำ</option>
          <option value="maintenance">ซ่อมบำรุง</option>
          <option value="fix">ซ่อมแก้ไข</option>
          <option value="others">อื่นๆ</option>
        </select>
      </label>

      <label>
        แผนเริ่มงาน
        <input
          type="date"
          name="planWorkDayStart"
          value={formatDateInput(safe(formData.planWorkDayStart))}
          onChange={handleChange}
        />
      </label>

      <label>
        แผนจบงาน
        <input
          type="date"
          name="planWorkDayEnd"
          value={formatDateInput(safe(formData.planWorkDayEnd))}
          onChange={handleChange}
        />
      </label>

      <label>
        เริ่มปฏิบัติงาน
        <input
          type="date"
          name="actualWorkDayStart"
          value={formatDateInput(safe(formData.actualWorkDayStart))}
          onChange={handleChange}
        />
      </label>

      <label>
        จบปฏิบัติงาน
        <input
          type="date"
          name="actualWorkDayEnd"
          value={formatDateInput(safe(formData.actualWorkDayEnd))}
          onChange={handleChange}
        />
      </label>

      <label>
        Tags (comma-separated)
        <input name="tags" value={formData.tags} onChange={handleChange} />
      </label>

      <label>
        รายงาน
        <input
          name="report"
          value={safe(formData.report)}
          onChange={handleChange}
        />
      </label>

      <label>
        เอกสาร (comma-separated)
        <input
          name="documents"
          value={formData.documents}
          onChange={handleChange}
        />
      </label>

      {!preview && <button onClick={() => setPreview(true)}>Preview</button>}

      {preview && (
        <div className="preview-box">
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button
            onClick={() =>
              handleSubmit(formData, setSubmitted, setPreview, router.push)
            }
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
