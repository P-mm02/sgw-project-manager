'use client'

export default function ComingNotify() {
  const upcoming = [
    { id: 1, title: 'ตรวจสอบระบบน้ำ', date: '2025-07-10' },
    { id: 2, title: 'ต่ออายุใบอนุญาต', date: '2025-07-12' },
  ]

  return (
    <div className="notification-list">
      {upcoming.map((item) => (
        <div key={item.id} className="notification-card">
          📅 <strong>{item.title}</strong>
          <br />
          🗓️ {item.date}
        </div>
      ))}
    </div>
  )
}
