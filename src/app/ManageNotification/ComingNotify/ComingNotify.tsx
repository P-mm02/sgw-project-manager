'use client'

import type { NotificationType } from '@/types/NotificationType'
import '../EditNotify/NotifyEditModal.css'
import { useEditNotify } from '../EditNotify/editNotify'
import NotificationEditModal from '../EditNotify/NotificationEditModal'
import CircleSpining from '@/loading/CircleSpining/CircleSpining'

export default function ComingNotify({
  notifications = [],
  loading = false,
  error = null,
}: {
  notifications?: NotificationType[]
  loading?: boolean
  error?: string | null
}) {
  // ---- Use the hook here! ----
const {
  editing,
  editForm,
  saving,
  handleEditClick,
  handleEditChange,
  handleEditSave,
  handleEditCancel,
  handleNotifyDateChange, // <-- Add this
} = useEditNotify()


  if (loading) return <CircleSpining />
  if (error) return <div>Error: {error}</div>

  // Upcoming = notifyDate in the future (or today)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const upcoming = notifications.filter(
    (item) => new Date(item.notifyDate) >= now
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
      {upcoming.length > 0 ? (
        upcoming.map((item) => {
          const notifyDate = new Date(item.notifyDate)
          notifyDate.setHours(0, 0, 0, 0)
          const daysLeft = Math.ceil(
            (notifyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          )

          return (
            <div key={item._id || item.id} className="notification-card">
              {/* Absolute Delete Button */}
              <button
                className="delete-btn"
                title="ลบการแจ้งเตือนนี้"
                onClick={() => handleDelete(item._id || item.id)}
                aria-label="ลบ"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="text-wrap notify-title">
                📅 <strong>{item.title}</strong>
              </div>
              <div className="text-wrap">
                <strong>รายละเอียด:</strong>{' '}
                <span style={{ whiteSpace: 'pre-line' }}>
                  {item.detail || '-'}
                </span>
              </div>
              <div>
                <strong>วันครบกำหนด: </strong>
                {new Date(item.notifyDate).toLocaleDateString('th-TH')}
              </div>
              <div>
                <strong>เหลือเวลาอีก: </strong>
                {daysLeft} วัน
              </div>
              <div className="text-wrap">
                <strong>แจ้งเตือนล่วงหน้า: </strong>
                {Array.isArray(item.notifyBeforeDays) &&
                item.notifyBeforeDays.length > 0
                  ? item.notifyBeforeDays.join(', ') + ' วัน'
                  : 'ไม่ระบุ'}{' '}
              </div>
              <div className="text-wrap">
                {Array.isArray(item.notifiedDays) &&
                item.notifiedDays.length > 0 ? (
                  <>
                    <strong>แจ้งล่วงหน้าแล้ว:</strong>{' '}
                    {item.notifiedDays.join(', ')} วัน
                  </>
                ) : (
                  'ยังไม่มีการแจ้งเตือนล่วงหน้า'
                )}
              </div>
              <div className="text-wrap">
                <strong>สถานะ: </strong>
                {item.isNotified ? 'แจ้งเตือนครบแล้ว' : 'รอแจ้งเตือน'}
              </div>
              <div>
                <strong>สร้างโดย: </strong>
                {item.createdBy || '-'}
              </div>
              <div style={{ fontSize: '0.9em', color: '#888' }}>
                สร้างเมื่อ:{' '}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString('th-TH')
                  : '-'}
              </div>
              <button
                className="notify-edit"
                onClick={() => handleEditClick(item)}
              >
                แก้ไข
              </button>
            </div>
          )
        })
      ) : (
        <div style={{ color: '#aaa' }}>ไม่พบการแจ้งเตือนที่กำลังจะมาถึง</div>
      )}
      {/* --- Modal: Now using your new modal component! --- */}
      <NotificationEditModal
        open={!!editing}
        editForm={editForm}
        saving={saving}
        onChange={handleEditChange}
        onNotifyDateChange={handleNotifyDateChange} // <-- Add this
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
    </div>
  )
}
