// src/app/license/edit/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { formatDateToThai } from '@/lib/date/formatDateToThai'
import '@/app/license/add/page.css' // reuse same styles
import type { LicenseType } from '@/types/LicenseType'
import DotsLoader from '@/loading/DotsLoader/DotsLoader'
import type { LicenseFormState } from '@/types/LicenseFormState'


export default function EditLicensePage() {
  const { id } = useParams()
  const router = useRouter()

  const [formData, setFormData] = useState<LicenseFormState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLicense = async () => {
      const res = await fetch(`/api/license/${id}`)
      if (!res.ok) {
        alert('❌ Failed to fetch license data')
        return
      }

      const data: LicenseType = await res.json()

      const formSafe: LicenseFormState = {
        clientName: data.clientName || '',
        licenseNumber: data.licenseNumber || '',
        licenseType: data.licenseType || '',
        wellNumber: data.wellNumber || '',
        clientAddress: data.clientAddress || '',
        wellDescription: data.wellDescription || '',
        depthStart: data.depthStart?.toString() || '',
        depthEnd: data.depthEnd?.toString() || '',
        wellWidth: data.wellWidth?.toString() || '',
        licenseIssuedDate: data.licenseIssuedDate?.slice(0, 10) || '',
        licenseExpireDate: data.licenseExpireDate?.slice(0, 10) || '',
      }

      setFormData(formSafe)
      setLoading(false)
    }

    if (id) fetchLicense()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!formData) return
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return // safeguard
    const payload = {
      ...formData,
      depthStart: Number(formData.depthStart),
      depthEnd: Number(formData.depthEnd),
      wellWidth: Number(formData.wellWidth),
    }

    const res = await fetch(`/api/license/${id}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      alert('✅ แก้ไขข้อมูลใบอนุญาตสำเร็จ')
      router.push('/license')
    } else {
      alert('❌ ไม่สามารถแก้ไขข้อมูลได้')
    }
  }

  const handleLicenseNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11)
    const formatted = value.replace(
      /^(\d{2})(\d{0,5})(\d{0,4}).*/,
      (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('-')
    )
    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, licenseNumber: formatted }
    })


  }

  const handleWellNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    const formatted = value.replace(/^(\d{0,6})(\d{0,4}).*/, (_, p1, p2) =>
      [p1, p2].filter(Boolean).join('-')
    )
    setFormData((prev) => {
      if (!prev) return prev
      return { ...prev, LicenseType: formatted }
    })

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
    } เมตร | ความกว้างไม่เกิน ${updated.wellWidth || '_'} มิลลิเมตร`
    setFormData(updated)
  }
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  

  if (loading || !formData)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', height: '40vh' }}
        className="license-form"
      >
        <DotsLoader />
      </div>
    )
  
  return (
      <form onSubmit={handleSubmit} className="license-form">
        <label>
          ชื่อลูกค้า / โครงการ:
          <input
            type="text"
            name="clientName"
            value={formData.clientName || ''}
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
            value={formData.licenseNumber || ''}
            onChange={handleLicenseNumberChange}
            pattern="\d{2}-\d{5}-\d{4}"
            required
          />
        </label>

        <label>
          เลขบ่อ:
          <input
            type="text"
            name="wellNumber"
            value={formData.wellNumber || ''}
            onChange={handleWellNumberChange}
            pattern="\d{6}-\d{4}"
          />
        </label>

        <label>
          ที่อยู่ลูกค้า:
          <textarea
            name="clientAddress"
            value={formData.clientAddress || ''}
            onChange={handleChange}
          />
        </label>

        <label>
          รายละเอียดบ่อ:
          <input
            type="text"
            name="wellDescription"
            value={formData.wellDescription || ''}
            onChange={handleChange}
            required
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

        <button type="submit">💾 บันทึกการแก้ไข</button>
      </form>
  )
}
