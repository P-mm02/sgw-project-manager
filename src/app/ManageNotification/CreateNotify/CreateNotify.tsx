'use client'

import { useState } from 'react'

export default function CreateNotify() {
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Create Notify:', { title, detail, date })
    // TODO: send to backend
    setTitle('')
    setDetail('')
    setDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="notify-form">
      <input
        type="text"
        placeholder="หัวข้อแจ้งเตือน"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="รายละเอียด"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">บันทึก</button>
    </form>
  )
}
