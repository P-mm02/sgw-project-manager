'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

type Props = {
  id: string
}

export default function DeleteLicenseButton({ id }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    const confirmed = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบใบอนุญาตนี้?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/license/${id}/delete`, {
        method: 'DELETE',
      })

      if (res.ok) {
        startTransition(() => {
          router.refresh()
        })
      } else {
        alert('เกิดข้อผิดพลาดในการลบใบอนุญาต')
      }
    } catch (err) {
      console.error(err)
      alert('ไม่สามารถลบได้ กรุณาลองใหม่')
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="delete-btn"
      disabled={isPending}
    >
      🗑️ {isPending ? 'กำลังลบ...' : 'ลบใบอนุญาต'}
    </button>
  )
}
