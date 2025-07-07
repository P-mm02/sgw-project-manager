'use client'

export default function ExpireNotify() {
  const expired = [
    { id: 1, title: 'ส่งรายงานมิ.ย.', date: '2025-06-30' },
    { id: 2, title: 'แจ้งเตือนเครื่องจักร', date: '2025-06-20' },
  ]

  return (
    <div className="notification-list">
      {expired.map((item) => (
        <div key={item.id} className="notification-card expired">
          ❌ <strong>{item.title}</strong>
          <br />
          📆 {item.date}
        </div>
      ))}
    </div>
  )
}
