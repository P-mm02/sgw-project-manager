'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'


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
  const [notifications, setNotifications] = useState([]) // Example state

  return (
    <div className="notification-grid">
      {/* Column 1 */}
      <section className="notification-column">
        <h2>🔔 การแจ้งเตือนที่กำลังจะมาถึง</h2>
        <ComingNotify/>
      </section>

      {/* Column 2 */}
      <section className="notification-column form-column">
        <h2>➕ สร้างแจ้งเตือนใหม่</h2>
        <CreateNotify/>
      </section>

      {/* Column 3 */}
      <section className="notification-column">
        <h2>⌛ การแจ้งเตือนที่หมดอายุ</h2>
        <ExpireNotify/>
      </section>
    </div>
  )
}
