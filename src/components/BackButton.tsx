'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <>
      <button type="button" onClick={() => router.back()} className="btn back">
        ◀ ย้อนกลับ
      </button>
      <style jsx>{`
        .btn.back {
          font-weight: 700;
          background-color: #ffffffff;
          border: 2px solid #cbd5e0;
          color: #2d3748;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          margin: 1rem;
        }
        .btn.back:hover {
          background-color: #e7f3ffff;
        }
      `}</style>
    </>
  )
}
