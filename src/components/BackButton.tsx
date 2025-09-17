'use client'

import { useRouter } from 'next/navigation'
import './BackButton.css'

export default function BackButton() {
  const router = useRouter()

  return (
      <button type="button" onClick={() => router.back()} className="btn back">
        ◀ ย้อนกลับ
      </button>
  )
}
