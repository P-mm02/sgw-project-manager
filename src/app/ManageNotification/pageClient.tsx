'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ComingNotify = dynamic(() => import('./ComingNotify/ComingNotify'), {
  ssr: false,
})
const CreateNotify = dynamic(() => import('./CreateNotify/CreateNotify'), {
  ssr: false,
})
const ExpireNotify = dynamic(() => import('./ExpireNotify/ExpireNotify'), {
  ssr: false,
})

export default function PageClient() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications when component mounts
useEffect(() => {
  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/manage-notification')
      if (!res.ok) throw new Error('Failed to fetch notifications')
      const data = await res.json()
      setNotifications(data.notifications)
    } catch (err: any) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }
  fetchNotifications()
}, [])

  // For real-world use: pass setNotifications to CreateNotify for auto-refresh after adding

  return (
    <div className="notification-grid display-grid-column">
      {/* Column 1 */}
      <section className="notification-column">
        <h2>🔔 การแจ้งเตือนที่กำลังจะมาถึง</h2>
        <ComingNotify
          notifications={notifications}
          loading={loading}
          error={error}
        />
      </section>

      {/* Column 2 */}
      <section className="notification-column form-column">
        <h2>➕ สร้างแจ้งเตือนใหม่</h2>
        <CreateNotify
          onCreated={() => {
            // re-fetch after create (optional, for instant update)
            fetch('/api/manage-notification')
              .then((res) => res.json())
              .then((data) => setNotifications(data.notifications))
          }}
        />
      </section>

      {/* Column 3 */}
      <section className="notification-column">
        <h2>⌛ การแจ้งเตือนที่หมดอายุ</h2>
        <ExpireNotify
          notifications={notifications}
          loading={loading}
          error={error}
        />
      </section>
    </div>
  )
}
