'use client'
import { useState } from 'react'
import './WorkTypeSelect.css'

type WorkTypeSelectProps = {
  setWorkType: (value: string) => void
}

const workTypes = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'เจาะ', value: 'drilling' },
  { label: 'สำรวจ', value: 'survey' },
  { label: 'สูบลดระดับน้ำ', value: 'dewatering' },
  { label: 'ซ่อมบำรุง', value: 'maintenance' },
  { label: 'ซ่อมแก้ไข', value: 'fix' },
  { label: 'อื่นๆ', value: 'others' },
]

export default function WorkTypeSelect({ setWorkType }: WorkTypeSelectProps) {
  const [active, setActive] = useState('all')

  const handleClick = (value: string) => {
    setActive(value)
    setWorkType(value)
  }

  return (
    <div className="workType-select-Con">
      {workTypes.map(({ label, value }) => (
        <button
          key={value}
          className={`workType-btn ${active === value ? 'active' : ''}`}
          onClick={() => handleClick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
