'use client'

import './page.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddLicensePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clientName: '',
    licenseNumber: '',
    licenseType: '',
    wellNumber: '',
    clientAddress: '',
    wellDescription: '',
    licenseIssuedDate: '',
    licenseExpireDate: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/license', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      alert('✅ เพิ่มข้อมูลใบอนุญาตสำเร็จ')
      router.push('/license')
    } else {
      alert('❌ ไม่สามารถเพิ่มข้อมูลได้')
    }
  }

  return (
    <main className="license-form-container">
      <h1>➕ เพิ่มข้อมูลใบอนุญาต</h1>
      <form onSubmit={handleSubmit} className="license-form">
        <label>
          ชื่อลูกค้า / โครงการ:
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          ประเภทใบอนุญาต
          <select
            name="licenseType"
            value={formData.licenseType}
            onChange={handleChange}
            required
          >
            <option value="">-- เลือกประเภท --</option>
            <option value="drilling">เจาะบ่อ</option>
            <option value="waterUse">ใช้น้ำ</option>
            <option value="modify">แก้ไขบ่อ</option>
            <option value="cancel">ยกเลิกบ่อ</option>
          </select>
        </label>

        <label>
          เลขใบอนุญาต:
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          เลขบ่อ:
          <input
            type="text"
            name="wellNumber"
            value={formData.wellNumber}
            onChange={handleChange}
          />
        </label>

        <label>
          ที่อยู่ลูกค้า:
          <textarea
            name="clientAddress"
            value={formData.clientAddress}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          รายละเอียดบ่อ:
          <textarea
            name="wellDescription"
            value={formData.wellDescription}
            onChange={handleChange}
          />
        </label>

        <label>
          วันที่เริ่มใช้ใบอนุญาต:
          <input
            type="date"
            name="licenseIssuedDate"
            value={formData.licenseIssuedDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          วันหมดอายุใบอนุญาต:
          <input
            type="date"
            name="licenseExpireDate"
            value={formData.licenseExpireDate}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">💾 บันทึกใบอนุญาต</button>
      </form>
    </main>
  )
}
