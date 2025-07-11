'use client'

import type { NotificationType } from '@/types/NotificationType'

export default function ExpireNotify({
  notifications = [],
  loading = false,
  error = null,
}: {
  notifications?: NotificationType[]
  loading?: boolean
  error?: string | null
}) {
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Expired = notifyDate in the past (before today)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const expired = notifications.filter(
    (item) => new Date(item.notifyDate) < now
  )

  return (
    <div className="notification-list">
      {expired.length > 0 ? (
        expired.map((item) => {
          const notifyBefore =
            Array.isArray(item.notifyBeforeDays) &&
            item.notifyBeforeDays.length > 0
              ? item.notifyBeforeDays.join(', ')
              : '-'

          const notified =
            Array.isArray(item.notifiedDays) && item.notifiedDays.length > 0
              ? `แจ้งล่วงหน้าแล้ว: ${item.notifiedDays.join(', ')} วัน`
              : 'ยังไม่มีการแจ้งล่วงหน้า'

          return (
            <div
              key={item._id || item.id}
              className="notification-card expired"
            >
              <div>
                ❌ <strong>{item.title}</strong>
              </div>
              <div>รายละเอียด: {item.detail || '-'}</div>
              <div>
                วันที่แจ้งเตือน:{' '}
                {new Date(item.notifyDate).toLocaleDateString('th-TH')}
              </div>
              <div>แจ้งเตือนล่วงหน้า: {notifyBefore} วัน</div>
              <div>{notified}</div>
              <div>
                สถานะ: {item.isNotified ? 'แจ้งเตือนครบแล้ว' : 'รอแจ้งเตือน'}
              </div>
              <div>สร้างโดย: {item.createdBy || '-'}</div>
              <div style={{ fontSize: '0.9em', color: '#888' }}>
                สร้างเมื่อ:{' '}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString('th-TH')
                  : '-'}
              </div>
            </div>
          )
        })
      ) : (
        <div style={{ color: '#aaa' }}>ไม่พบการแจ้งเตือนที่หมดอายุ</div>
      )}
    </div>
  )
}
