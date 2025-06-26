'use client'
import { useState } from 'react'
import './WorkTypeSelect.css'

type WorkTypeSelectProps = {
  setWorkType: (value: string) => void
}

const workTypes = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'งานเจาะ', value: 'drilling' },
  { label: 'งานสำรวจ', value: 'survey' },
  { label: 'งานสูบลดระดับน้ำ', value: 'dewatering' },
  { label: 'งานซ่อมบำรุง', value: 'maintenance' },
  { label: 'งานอื่นๆ', value: 'others' },
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
