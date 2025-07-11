'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import './collapes.css'
import CollapsePanel from './CollapsePanel'

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect mobile width (<= 768px)
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // On mobile: start closed; On desktop: start open
  const defaultOpen = !isMobile

  return (
    <div className="notification-grid display-grid-column">
      <section className="notification-column">
        <CollapsePanel
          title="🔔 คิวการแจ้งเตือน"
          defaultOpen={defaultOpen}
        >
          <ComingNotify
            notifications={notifications}
            loading={loading}
            error={error}
          />
        </CollapsePanel>
      </section>
      <section className="notification-column form-column">
        <CollapsePanel title="➕ สร้างแจ้งเตือนใหม่" defaultOpen={defaultOpen}>
          <CreateNotify
            onCreated={() => {
              fetch('/api/manage-notification')
                .then((res) => res.json())
                .then((data) => setNotifications(data.notifications))
            }}
          />
        </CollapsePanel>
      </section>
      <section className="notification-column">
        <CollapsePanel
          title="⌛ การแจ้งเตือนที่หมดอายุ"
          defaultOpen={defaultOpen}
        >
          <ExpireNotify
            notifications={notifications}
            loading={loading}
            error={error}
          />
        </CollapsePanel>
      </section>
    </div>
  )
}
