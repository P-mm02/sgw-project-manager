'use client'
import { useState } from 'react'
import './AddProject.css'

export default function AddProject() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    workType: '',
    planWorkDayStart: '',
    planWorkDayEnd: '',
    actualWorkDayStart: '',
    actualWorkDayEnd: '',
  })

  const [preview, setPreview] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreview = () => setPreview(true)

  const handleSubmit = async () => {
    const res = await fetch('/api/add-project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) {
      setSubmitted(true)
      setPreview(false)
    }
  }

  return (
    <div className="add-project-form">
      <h2 className="add-project-head">เพิ่มโปรเจค</h2>

      {[
        'name',
        'location',
        'planWorkDayStart',
        'planWorkDayEnd',
        'actualWorkDayStart',
        'actualWorkDayEnd',
      ].map((field) => (
        <div className="input-con" key={field}>
          <label>ชื่อโครงการ</label>
          <input
            type="text"
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="input-con">
        <label>workType</label>
        <select
          name="workType"
          value={formData.workType}
          onChange={handleChange}
        >
          <option value="">Select Type</option>
          <option value="drilling">drilling</option>
          <option value="survey">survey</option>
          <option value="dewatering">dewatering</option>
          <option value="maintenance">maintenance</option>
          <option value="others">others</option>
        </select>
      </div>

      {!preview && <button onClick={handlePreview}>Preview</button>}

      {preview && (
        <div className="preview-box">
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button onClick={handleSubmit}>Confirm & Save</button>
          <button onClick={() => setPreview(false)}>Back</button>
        </div>
      )}

      {submitted && <p>✅ Project saved successfully!</p>}
    </div>
  )
}
