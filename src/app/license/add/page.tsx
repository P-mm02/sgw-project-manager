'use client'

import './page.css'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateToThai } from '@/lib/formatDateToThai'


export default function AddLicensePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    clientName: '',
    licenseNumber: '',
    licenseType: '',
    wellNumber: '',
    clientAddress: '',
    depthStart: '',
    depthEnd: '',
    wellWidth: '',
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

  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/\D/g, '') // remove non-numeric
    if (value.length > 11) value = value.slice(0, 11)

    const formatted = value.replace(
      /^(\d{2})(\d{0,5})(\d{0,4}).*/,
      (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('-')
    )

    setFormData((prev) => ({
      ...prev,
      licenseNumber: formatted,
    }))
  }
  const handlewellNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/\D/g, '') // remove non-numeric
    if (value.length > 11) value = value.slice(0, 11)

    const formatted = value.replace(
      /^(\d{0,6})(\d{0,4}).*/,
      (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('-')
    )

    setFormData((prev) => ({
      ...prev,
      wellNumber: formatted,
    }))
  }
  
  const handleWellDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    const updated = {
      ...formData,
      [name]: value,
    }

    updated.wellDescription = `ความลึก ${updated.depthStart || '_'}-${
      updated.depthEnd || '_'
    } เมตร | ความกว้างไม่เกิน ${updated.wellWidth || '_'} เมตร`

    setFormData(updated)
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
            onChange={handleLicenseNumberChange}
            pattern="\d{2}-\d{5}-\d{4}"
            placeholder="ตัวอย่าง 12-34567-8910"
            required
          />
        </label>

        <label>
          เลขบ่อ:
          <input
            type="text"
            name="wellNumber"
            value={formData.wellNumber}
            onChange={handlewellNumberChange}
            pattern="\d{6}-\d{4}"
            placeholder="ตัวอย่าง 123456-7890"
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

        <label className="well-description-label">
          รายละเอียดบ่อ:
          <div className="well-description-group">
            <span>ความลึก</span>
            <input
              type="number"
              name="depthStart"
              value={formData.depthStart || ''}
              onChange={handleWellDescriptionChange}
              placeholder="ตื้นสุด"
            />
            <span>-</span>
            <input
              type="number"
              name="depthEnd"
              value={formData.depthEnd || ''}
              onChange={handleWellDescriptionChange}
              placeholder="ลึกสุด"
            />
            <span>เมตร | ความกว้างไม่เกิน</span>
            <input
              type="number"
              name="wellWidth"
              value={formData.wellWidth || ''}
              onChange={handleWellDescriptionChange}
              placeholder="กว้างสุด"
            />
            <span>เมตร</span>
          </div>
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
          <div className="thai-date-preview">
            {formatDateToThai(formData.licenseIssuedDate)}
          </div>
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
          <div className="thai-date-preview">
            {formatDateToThai(formData.licenseExpireDate)}
          </div>
        </label>

        <button type="submit">💾 บันทึกใบอนุญาต</button>
      </form>
    </main>
  )
}
