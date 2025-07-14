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

  const handleDelete = async (id: string) => {
    if (confirm('ต้องการลบการแจ้งเตือนนี้จริงหรือไม่?')) {
      const res = await fetch('/api/manage-notification/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('ลบไม่สำเร็จ')
      }
    }
  }

  return (
    <div className="notification-list">
      {expired.length > 0 ? (
        expired.map((item) => {
          const notifyBefore =
            Array.isArray(item.notifyBeforeDays) &&
            item.notifyBeforeDays.length > 0
              ? item.notifyBeforeDays.join(', ')
              : '-'

          return (
            <div
              key={item._id || item.id}
              className="notification-card expired"
            >
              {/* Absolute Delete Button */}
              <button
                className="delete-btn"
                title="ลบการแจ้งเตือนนี้"
                onClick={() => handleDelete(item._id || item.id)}
                aria-label="ลบ"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className='text-wrap'>
                ❌ <strong>{item.title}</strong>
              </div>
              <div className='text-wrap'>รายละเอียด: {item.detail || '-'}</div>
              <div>
                วันครบกำหนด:{' '}
                {new Date(item.notifyDate).toLocaleDateString('th-TH')}
              </div>
              <div className='text-wrap'>
                แจ้งเตือนล่วงหน้า:{' '}
                {Array.isArray(item.notifyBeforeDays) &&
                item.notifyBeforeDays.length > 0
                  ? item.notifyBeforeDays.join(', ') + ' วัน'
                  : 'ไม่ระบุ'}{' '}
              </div>
              <div className='text-wrap'>
                {Array.isArray(item.notifiedDays) &&
                item.notifiedDays.length > 0
                  ? `แจ้งล่วงหน้าแล้ว: ${item.notifiedDays.join(', ')} วัน`
                  : 'ยังไม่มีการแจ้งเตือนล่วงหน้า'}
              </div>
              <div className='text-wrap'>
                สถานะ: {item.isNotified ? 'แจ้งเตือนครบแล้ว' : 'รอแจ้งเตือน'}
              </div>
              <div className='text-wrap'>สร้างโดย: {item.createdBy || '-'}</div>
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
