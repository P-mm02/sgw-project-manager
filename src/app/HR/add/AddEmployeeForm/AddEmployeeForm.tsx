// src/app/HR/add/AddEmployeeForm/AddEmployeeForm.tsx
'use client'

import React, { useState } from 'react'
import { initialEmployeeFormState } from '@/constants/employee/initialEmployeeFormState'
import type { EmployeeFormState } from '@/types/EmployeeFormState'
import './AddEmployeeForm.css'
import { addressEngToThai } from '@/lib/employee/addressEngToThai'

export default function AddEmployeeForm() {
  const [formData, setFormData] = useState<EmployeeFormState>(initialEmployeeFormState)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
type NestedObjectKey = 'currentAddress' | 'idCardAddress' | 'bankInfo' | 'team'

  const handleNestedChange = (
    section: NestedObjectKey,
    key: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // TODO: Send to API
  }

  return (
    <form className="add-employee-form" onSubmit={handleSubmit}>
      <label>ชื่อจริง</label>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <label>นามสกุล</label>
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />

      <label>ชื่อเล่น</label>
      <input
        name="nickName"
        value={formData.nickName}
        onChange={handleChange}
      />

      <label>ตำแหน่ง</label>
      <input
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
      />

      <label>แผนก</label>
      <input
        name="department"
        value={formData.department}
        onChange={handleChange}
      />

      <label>อีเมล</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <label>เบอร์โทรศัพท์</label>
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      <label>วันเกิด</label>
      <input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
      />

      <label>วันเริ่มงาน</label>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
      />

      <hr />

      <h3>📍 ที่อยู่ปัจจุบัน</h3>
      {Object.keys(formData.currentAddress).map((key) => (
        <div key={key}>
          <label>{addressEngToThai[key] || key}</label>
          <input
            name={key}
            value={
              formData.currentAddress?.[
                key as keyof typeof formData.currentAddress
              ] || ''
            }
            onChange={(e) =>
              handleNestedChange('currentAddress', key, e.target.value)
            }
          />
        </div>
      ))}

      <h3>🪪 ที่อยู่บัตรประชาชน</h3>
      {Object.keys(formData.idCardAddress).map((key) => (
        <div key={key}>
          <label>{addressEngToThai[key] || key}</label>
          <input
            name={key}
            value={
              formData.idCardAddress?.[
                key as keyof typeof formData.idCardAddress
              ] || ''
            }
            onChange={(e) =>
              handleNestedChange('idCardAddress', key, e.target.value)
            }
          />
        </div>
      ))}

      <h3>🏦 ข้อมูลธนาคาร</h3>
      <label>ธนาคาร</label>
      <input
        name="bankName"
        value={formData.bankInfo.bankName}
        onChange={(e) =>
          handleNestedChange('bankInfo', 'bankName', e.target.value)
        }
      />
      <label>เลขบัญชี</label>
      <input
        name="accountNumber"
        value={formData.bankInfo.accountNumber}
        onChange={(e) =>
          handleNestedChange('bankInfo', 'accountNumber', e.target.value)
        }
      />

      <h3>👥 ทีม</h3>
      <label>ทีม</label>
      <input
        name="name"
        value={formData.team.name}
        onChange={(e) => handleNestedChange('team', 'name', e.target.value)}
      />
      <label>หน้าที่</label>
      <input
        name="role"
        value={formData.team.role}
        onChange={(e) => handleNestedChange('team', 'role', e.target.value)}
      />

      <h3>ร่างกาย</h3>
      <label>น้ำหนัก (kg)</label>
      <input
        type="number"
        name="weight"
        value={formData.weight}
        min={0}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            weight: Number(e.target.value),
          }))
        }
      />

      <label>ส่วนสูง (cm)</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        min={0}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            height: Number(e.target.value),
          }))
        }
      />

      <button type="submit">บันทึกข้อมูลพนักงาน</button>
    </form>
  )
}
